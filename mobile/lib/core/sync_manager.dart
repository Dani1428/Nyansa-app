import 'dart:io' as io;
import 'dart:convert';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:crypto/crypto.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:geolocator/geolocator.dart';
import 'api_service.dart';
import 'queue_service.dart';

class DeviceFingerprint {
  final String deviceId;
  final String deviceModel;
  final String osVersion;

  const DeviceFingerprint({
    required this.deviceId,
    required this.deviceModel,
    required this.osVersion,
  });

  Map<String, String> toMap() => {
    'device_id': deviceId,
    'device_model': deviceModel,
    'os_version': osVersion,
  };
}

/// Handles anti-fraud embedded logic on mobile
class FraudGuard {
  static final DeviceInfoPlugin _deviceInfo = DeviceInfoPlugin();

  /// Get full device fingerprint: ID + model + OS version
  static Future<DeviceFingerprint> getFingerprint() async {
    if (kIsWeb) {
      return const DeviceFingerprint(
        deviceId: 'web_device',
        deviceModel: 'Web Browser',
        osVersion: 'Web',
      );
    }
    try {
      if (io.Platform.isAndroid) {
        final info = await _deviceInfo.androidInfo;
        return DeviceFingerprint(
          deviceId: info.id,
          deviceModel: '${info.brand} ${info.model}',
          osVersion: 'Android ${info.version.release}',
        );
      } else if (io.Platform.isIOS) {
        final info = await _deviceInfo.iosInfo;
        return DeviceFingerprint(
          deviceId: info.identifierForVendor ?? 'unknown',
          deviceModel: info.model,
          osVersion: '${info.systemName} ${info.systemVersion}',
        );
      }
    } catch (_) {}
    return const DeviceFingerprint(
      deviceId: 'unknown_device',
      deviceModel: 'Generic',
      osVersion: 'Unknown',
    );
  }

  /// Legacy method for backward compatibility
  static Future<String> getDeviceId() async {
    final fp = await getFingerprint();
    return fp.deviceId;
  }

  /// Capture GPS location (mandatory for all submissions)
  static Future<Map<String, double?>> captureGPS() async {
    try {
      // Geolocator works on web
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) return {'lat': null, 'long': null};

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) return {'lat': null, 'long': null};
      }

      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.medium,
        timeLimit: const Duration(seconds: 10),
      );
      return {'lat': position.latitude, 'long': position.longitude};
    } catch (_) {
      return {'lat': null, 'long': null};
    }
  }

  /// Compute MD5 checksum of a file for duplicate detection
  static Future<String?> computeChecksum(String? filePath) async {
    if (filePath == null || kIsWeb) return null;
    try {
      final bytes = await io.File(filePath).readAsBytes();
      return md5.convert(bytes).toString();
    } catch (_) {
      return null;
    }
  }

  /// Check if file looks suspicious (too small)
  static bool isFileSuspicious(String? filePath, String type) {
    if (filePath == null) return false;
    if (kIsWeb) return false; // Hard to check size via path on web easily here
    
    final file = io.File(filePath);
    if (!file.existsSync()) return true;
    final size = file.lengthSync();
    if (type == 'audio' && size < 10000) return true; // < 10KB
    if (type == 'image' && size < 5000) return true;  // < 5KB
    return false;
  }
}

/// Manages sync with retry, batch, and checksum validation
class SyncManager {
  final ApiService api;
  final OfflineQueueService queue;
  bool _isSyncing = false;

  SyncManager({required this.api, required this.queue});

  Future<SyncResult> syncAll() async {
    if (_isSyncing) return SyncResult(synced: 0, failed: 0, skipped: 0, errors: []);
    _isSyncing = true;

    int synced = 0;
    int failed = 0;
    int skipped = 0;
    List<String> errorMessages = [];

    try {
      final pending = await queue.getPending();

      for (final item in pending) {
        final res = await _syncItem(item);
        if (res['status'] == 'synced') {
          synced++;
        } else if (res['status'] == 'skipped') {
          skipped++;
        } else {
          failed++;
          if (res['message'] != null) errorMessages.add(res['message']);
        }
      }
    } finally {
      _isSyncing = false;
    }

    return SyncResult(synced: synced, failed: failed, skipped: skipped, errors: errorMessages);
  }

  /// Returns status: synced, failed, skipped
  Future<Map<String, dynamic>> _syncItem(QueuedItem item) async {
    // Anti-fraud: skip suspicious files
    if (FraudGuard.isFileSuspicious(item.filePath, item.type)) {
      await queue.markFailed(item.id);
      return {'status': 'skipped', 'message': 'Fichier suspect ou corrompu'};
    }

    try {
      final response = await api.uploadSubmission({
        'task_id': item.taskId,
        'content_text': item.contentText ?? '',
        'gps_lat': item.gpsLat ?? 0.0,
        'gps_long': item.gpsLong ?? 0.0,
        'device_id': item.deviceId,
        'local_id': item.id,
        'checksum': item.checksum ?? '',
        'language_id': item.languageId,
        'dialect_id': item.dialectId,
        'prompt_id': item.promptId,
        'duration': item.duration,
      }, item.filePath);

      if (response.success) {
        await queue.markSynced(item.id);
        return {'status': 'synced'};
      } else {
        // Keep in queue but mark as failed for this attempt
        return {'status': 'failed', 'message': response.message};
      }
    } catch (e) {
      return {'status': 'failed', 'message': e.toString()};
    }
  }
}

class SyncResult {
  final int synced;
  final int failed;
  final int skipped;
  final List<String> errors;
  SyncResult({required this.synced, required this.failed, required this.skipped, required this.errors});

  @override
  String toString() => 'Synced: $synced | Failed: $failed | Skipped: $skipped';
}
