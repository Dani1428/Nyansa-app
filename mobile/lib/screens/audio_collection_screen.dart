import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'dart:async';
import 'package:record/record.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:path_provider/path_provider.dart';
import '../core/queue_service.dart';
import '../core/sync_manager.dart';

class AudioCollectionScreen extends StatefulWidget {
  final int taskId;
  final String taskTitle;
  final int? languageId;
  final int? dialectId;
  final int? promptId;
  final String? promptText;

  const AudioCollectionScreen({
    super.key, 
    required this.taskId, 
    required this.taskTitle,
    this.languageId,
    this.dialectId,
    this.promptId,
    this.promptText,
  });

  @override
  State<AudioCollectionScreen> createState() => _AudioCollectionScreenState();
}

class _AudioCollectionScreenState extends State<AudioCollectionScreen> with TickerProviderStateMixin {
  late AudioRecorder _recorder;
  late AudioPlayer _player;
  late AnimationController _pulseController;
  bool _isRecording = false;
  int _seconds = 0;
  Timer? _timer;
  String? _lastPath;
  bool _isSaving = false;
  final OfflineQueueService _queue = OfflineQueueService();

  // Waveform simulation
  final List<double> _waveformBars = List.generate(30, (i) => 0.2);

  static const int _minDuration = 5; // 5 seconds minimum

  @override
  void initState() {
    super.initState();
    _recorder = AudioRecorder();
    _player = AudioPlayer();
    _pulseController = AnimationController(vsync: this, duration: const Duration(milliseconds: 800))
      ..repeat(reverse: true);
  }

  @override
  void dispose() {
    _recorder.dispose();
    _player.dispose();
    _timer?.cancel();
    _pulseController.dispose();
    super.dispose();
  }

  Future<void> _startRecording() async {
    if (await _recorder.hasPermission()) {
      String? path;
      if (!kIsWeb) {
        final directory = await getApplicationDocumentsDirectory();
        path = '${directory.path}/audio_${DateTime.now().millisecondsSinceEpoch}.m4a';
      }

      await _recorder.start(const RecordConfig(encoder: AudioEncoder.aacLc), path: path ?? '');
      setState(() { _isRecording = true; _seconds = 0; });

      _timer = Timer.periodic(const Duration(seconds: 1), (t) {
        setState(() {
          _seconds++;
          // Simulate waveform
          for (int i = 0; i < _waveformBars.length; i++) {
            _waveformBars[i] = 0.2 + (0.8 * (DateTime.now().millisecondsSinceEpoch % (i + 3)) / (i + 3));
          }
        });
      });
    } else {
      _showSnack('Permission microphone requise');
    }
  }

  Future<void> _stopRecording() async {
    final path = await _recorder.stop();
    _timer?.cancel();

    setState(() {
      _isRecording = false;
      _lastPath = path;
      for (int i = 0; i < _waveformBars.length; i++) _waveformBars[i] = 0.2;
    });

    if (_seconds < _minDuration) {
      _showSnack('❌ Minimum $_minDuration secondes requis (${_seconds}s enregistrées)');
    } else {
      _showSaveDialog();
    }
  }

  void _showSaveDialog() {
    bool isPlaying = false;
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          return AlertDialog(
            title: const Text('Vérifier l\'enregistrement'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('Écoutez votre enregistrement avant de le soumettre pour validation.'),
                const SizedBox(height: 20),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      IconButton(
                        icon: Icon(isPlaying ? Icons.stop_circle : Icons.play_circle_fill, size: 48, color: const Color(0xFF1F7A63)),
                        onPressed: () async {
                          if (isPlaying) {
                            await _player.stop();
                            setModalState(() => isPlaying = false);
                          } else {
                            if (_lastPath != null) {
                              await _player.play(kIsWeb ? UrlSource(_lastPath!) : DeviceFileSource(_lastPath!));
                              setModalState(() => isPlaying = true);
                              _player.onPlayerComplete.listen((_) {
                                if (ctx.mounted) setModalState(() => isPlaying = false);
                              });
                            }
                          }
                        },
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(isPlaying ? 'Lecture en cours...' : 'Prêt à l\'écoute', style: const TextStyle(fontWeight: FontWeight.bold)),
                            Text('Durée : $_seconds secondes', style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
                          ],
                        ),
                      )
                    ],
                  ),
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () {
                  _player.stop();
                  Navigator.pop(ctx);
                }, 
                child: const Text('Refaire', style: TextStyle(color: Colors.red))
              ),
              ElevatedButton(
                onPressed: () { 
                  _player.stop();
                  Navigator.pop(ctx); 
                  _saveToQueue(); 
                },
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1F7A63), foregroundColor: Colors.white),
                child: const Text('Soumettre'),
              ),
            ],
          );
        }
      ),
    );
  }

  Future<void> _saveToQueue() async {
    setState(() => _isSaving = true);

    // Anti-fraud: capture full device fingerprint
    final fingerprint = await FraudGuard.getFingerprint();

    // Anti-fraud: capture mandatory GPS
    final gps = await FraudGuard.captureGPS();
    if (gps['lat'] == null) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('⚠️ Localisation GPS requise. Activez la localisation et réessayez.'),
            backgroundColor: Colors.orange,
          ),
        );
      }
      setState(() => _isSaving = false);
      return;
    }

    await _queue.enqueue(
      type: 'audio',
      taskId: widget.taskId,
      filePath: _lastPath,
      gpsLat: gps['lat'],
      gpsLong: gps['long'],
      deviceId: fingerprint.deviceId,
      deviceModel: fingerprint.deviceModel,
      osVersion: fingerprint.osVersion,
      languageId: widget.languageId,
      dialectId: widget.dialectId,
      promptId: widget.promptId,
      duration: _seconds.toDouble(),
    );

    setState(() => _isSaving = false);
    if (mounted) {
      _showSnack('✅ Enregistrement mis en file de synchro !');
      Navigator.pop(context, true);
    }
  }

  void _showSnack(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  @override
  Widget build(BuildContext context) {
    final bool canStop = _isRecording;
    final bool durationOk = _seconds >= _minDuration;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(widget.taskTitle, style: const TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          if (widget.promptText != null) ...[
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: const Color(0xFF1F7A63).withOpacity(0.05),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF1F7A63).withOpacity(0.1)),
                ),
                child: Column(
                  children: [
                    const Text('TRADUIRE EN LANGUE LOCALE :', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: Color(0xFF1F7A63), letterSpacing: 1.2)),
                    const SizedBox(height: 12),
                    Text(
                      widget.promptText!,
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, height: 1.4),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 40),
          ],
          
          // Waveform visualizer
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 24),
            height: 80,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: _waveformBars.map((h) => AnimatedContainer(
                duration: const Duration(milliseconds: 100),
                width: 6,
                height: _isRecording ? (h * 70).clamp(8, 70) : 8,
                decoration: BoxDecoration(
                  color: _isRecording ? const Color(0xFF1F7A63) : Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(4),
                ),
              )).toList(),
            ),
          ),

          const SizedBox(height: 40),

          // Timer
          Text(
            '${_seconds ~/ 60}:${(_seconds % 60).toString().padLeft(2, '0')}',
            style: const TextStyle(fontSize: 56, fontWeight: FontWeight.w900, letterSpacing: -2),
          ),

          // Min duration indicator
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                durationOk ? Icons.check_circle : Icons.timer,
                size: 16,
                color: durationOk ? Colors.green : Colors.orange,
              ),
              const SizedBox(width: 4),
              Text(
                durationOk ? 'Durée minimum atteinte ✓' : 'Minimum $_minDuration secondes',
                style: TextStyle(
                  color: durationOk ? Colors.green : Colors.orange,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),

          const SizedBox(height: 48),

          // Record button
          GestureDetector(
            onTapDown: !_isRecording ? (_) => _startRecording() : null,
            onTapUp: canStop ? (_) => _stopRecording() : null,
            child: AnimatedBuilder(
              animation: _pulseController,
              builder: (ctx, child) {
                return Container(
                  width: _isRecording ? 100 + (_pulseController.value * 8) : 100,
                  height: _isRecording ? 100 + (_pulseController.value * 8) : 100,
                  decoration: BoxDecoration(
                    color: _isRecording ? Colors.red : const Color(0xFF1F7A63),
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: (_isRecording ? Colors.red : const Color(0xFF1F7A63)).withOpacity(0.3),
                        blurRadius: 20,
                        spreadRadius: _isRecording ? 8 : 2,
                      )
                    ],
                  ),
                  child: Icon(
                    _isRecording ? Icons.stop : Icons.mic,
                    color: Colors.white,
                    size: 44,
                  ),
                );
              },
            ),
          ),

          const SizedBox(height: 24),
          Text(
            _isRecording ? 'Relâchez pour arrêter' : 'Appuyez pour commencer',
            style: TextStyle(color: Colors.grey.shade500, fontSize: 14),
          ),

          if (_isSaving) ...[
            const SizedBox(height: 24),
            const CircularProgressIndicator(color: Color(0xFF1F7A63)),
            const Text('Enregistrement en file d\'attente...'),
          ],
        ],
      ),
    );
  }
}
