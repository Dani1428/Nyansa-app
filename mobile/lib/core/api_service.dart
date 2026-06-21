import 'dart:convert';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  /// - Chrome/Web on same PC → localhost:8000
  /// - real device on network → 172.20.10.2:8000
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:8000/api/v1';
    }
    return 'http://172.20.10.2:8000/api/v1';
  }

  String? _token;
  bool hasToken() => _token != null;

  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('auth_token');
  }

  Future<void> setToken(String token) async {
    _token = token;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
  }

  Future<void> clearToken() async {
    _token = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
  }

  List<dynamic> _handleResponseList(http.Response response) {
    if (response.statusCode != 200) return [];
    final data = jsonDecode(response.body);
    if (data is Map && data.containsKey('results')) {
      return data['results'] as List<dynamic>;
    }
    if (data is List) return data;
    return [];
  }

  Future<Map<String, dynamic>> requestOTP(String phoneNumber) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/request-otp/'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'phone_number': phoneNumber}),
    );
    return jsonDecode(response.body);
  }

  Future<Map<String, dynamic>> verifyOTP(String phoneNumber, String otp) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/verify-otp/'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'phone_number': phoneNumber, 'otp': otp}),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode == 200) {
      await setToken(data['access']);
    }
    return data;
  }

  Future<List<dynamic>> fetchMissions() async {
    final response = await http.get(
      Uri.parse('$baseUrl/tasks/'),
      headers: {'Authorization': 'Bearer $_token'},
    );
    return _handleResponseList(response);
  }

  Future<ApiResponse> uploadSubmission(Map<String, dynamic> data, String? filePath) async {
    try {
      var request = http.MultipartRequest('POST', Uri.parse('$baseUrl/submissions/'));
      request.headers['Authorization'] = 'Bearer $_token';
      
      request.fields['task'] = data['task_id'].toString();
      request.fields['content_text'] = data['content_text'] ?? '';
      request.fields['gps_lat'] = data['gps_lat'].toString();
      request.fields['gps_long'] = data['gps_long'].toString();
      request.fields['device_id'] = data['device_id'];
      request.fields['local_id'] = data['local_id'];
      request.fields['checksum'] = data['checksum'] ?? '';
      
      if (data['language_id'] != null) {
        request.fields['language'] = data['language_id'].toString();
      }
      if (data['dialect_id'] != null) {
        request.fields['dialect'] = data['dialect_id'].toString();
      }
      if (data['prompt_id'] != null) {
        request.fields['prompt'] = data['prompt_id'].toString();
      }
      if (data['duration'] != null) {
        request.fields['duration'] = data['duration'].toString();
      }

      if (filePath != null && !kIsWeb) {
        request.files.add(await http.MultipartFile.fromPath('file', filePath));
      }

      final response = await request.send();
      final responseBody = await response.stream.bytesToString();
      
      if (response.statusCode == 201) {
        return ApiResponse(success: true);
      } else {
        String errorMsg = 'Erreur serveur';
        try {
          final decoded = jsonDecode(responseBody);
          errorMsg = decoded['detail'] ?? decoded['error'] ?? 'Échec de l\'envoi';
        } catch (_) {}
        return ApiResponse(success: false, message: errorMsg);
      }
    } catch (e) {
      return ApiResponse(success: false, message: 'Problème de connexion: $e');
    }
  }

  Future<List<dynamic>> fetchSubmissions() async {
    final response = await http.get(
      Uri.parse('$baseUrl/submissions/'),
      headers: {'Authorization': 'Bearer $_token'},
    );
    return _handleResponseList(response);
  }

  Future<List<dynamic>> fetchPayments() async {
    final response = await http.get(
      Uri.parse('$baseUrl/payments/'),
      headers: {'Authorization': 'Bearer $_token'},
    );
    return _handleResponseList(response);
  }

  Future<Map<String, dynamic>> fetchProfile() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/auth/profile/'),
        headers: {'Authorization': 'Bearer $_token'},
      );
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return {'error': 'Failed to load profile', 'status': response.statusCode};
    } catch (e) {
      return {'error': e.toString()};
    }
  }

  Future<void> updateProfileTelemetry(Map<String, dynamic> data) async {
    try {
      await http.patch(
        Uri.parse('$baseUrl/auth/profile/'),
        headers: {
          'Authorization': 'Bearer $_token',
          'Content-Type': 'application/json',
          },
        body: jsonEncode(data),
      );
    } catch (_) {}
  }

  Future<List<dynamic>> fetchNotifications() async {
    final response = await http.get(
      Uri.parse('$baseUrl/notifications/'),
      headers: {'Authorization': 'Bearer $_token'},
    );
    return _handleResponseList(response);
  }

  Future<bool> markNotificationAsRead(int id) async {
    final response = await http.post(
      Uri.parse('$baseUrl/notifications/$id/mark_as_read/'),
      headers: {'Authorization': 'Bearer $_token'},
    );
    return response.statusCode == 200;
  }
}

class ApiResponse {
  final bool success;
  final String? message;
  ApiResponse({required this.success, this.message});
}
