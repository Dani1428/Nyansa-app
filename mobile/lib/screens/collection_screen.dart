import 'dart:async';
import 'package:flutter/material.dart';
import 'package:record/record.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:io';

class AudioCollectionScreen extends StatefulWidget {
  final int taskId;
  final String taskTitle;

  const AudioCollectionScreen({super.key, required this.taskId, required this.taskTitle});

  @override
  State<AudioCollectionScreen> createState() => _AudioCollectionScreenState();
}

class _AudioCollectionScreenState extends State<AudioCollectionScreen> {
  late AudioRecorder _recorder;
  bool _isRecording = false;
  int _seconds = 0;
  Timer? _timer;
  String? _lastPath;

  @override
  void initState() {
    super.initState();
    _recorder = AudioRecorder();
  }

  @override
  void dispose() {
    _recorder.dispose();
    _timer?.cancel();
    super.dispose();
  }

  void _startRecording() async {
    if (await _recorder.hasPermission()) {
      final directory = await getApplicationDocumentsDirectory();
      final path = '${directory.path}/recording_${DateTime.now().millisecondsSinceEpoch}.m4a';

      await _recorder.start(const RecordConfig(), path: path);
      
      setState(() {
        _isRecording = true;
        _seconds = 0;
      });

      _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
        setState(() => _seconds++);
      });
    }
  }

  void _stopRecording() async {
    final path = await _recorder.stop();
    _timer?.cancel();
    
    setState(() {
      _isRecording = false;
      _lastPath = path;
    });

    if (_seconds < 5) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('L\'enregistrement doit durer au moins 5 secondes.')),
      );
    } else {
      _saveSubmission();
    }
  }

  void _saveSubmission() {
    // Logic to save to Drift database (skeleton)
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Enregistrement sauvegardé (Prêt pour synchro)')),
    );
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.taskTitle)),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.mic, size: 100, color: Color(0xFF1F7A63)),
            const SizedBox(height: 24),
            Text(
              '${_seconds ~/ 60}:${(_seconds % 60).toString().padLeft(2, '0')}',
              style: const TextStyle(fontSize: 48, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 48),
            GestureDetector(
              onTapDown: (_) => _startRecording(),
              onTapUp: (_) => _stopRecording(),
              child: Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  color: _isRecording ? Colors.red : const Color(0xFF1F7A63),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  _isRecording ? Icons.stop : Icons.mic,
                  color: Colors.white,
                  size: 48,
                ),
              ),
            ),
            const SizedBox(height: 16),
            Text(_isRecording ? 'Relâchez pour arrêter' : 'Maintenez pour enregistrer'),
          ],
        ),
      ),
    );
  }
}
