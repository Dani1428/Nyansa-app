import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:record/record.dart';
import 'package:path_provider/path_provider.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:image_picker/image_picker.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import '../core/api_service.dart';
import '../core/queue_service.dart';
import '../core/sync_manager.dart';
import 'dart:io' as io;
import 'dart:async';

class GuidedMissionScreen extends StatefulWidget {
  final Map<String, dynamic> mission;
  const GuidedMissionScreen({super.key, required this.mission});

  @override
  State<GuidedMissionScreen> createState() => _GuidedMissionScreenState();
}

class _GuidedMissionScreenState extends State<GuidedMissionScreen> {
  int _currentStep = 0;
  final PageController _pageController = PageController();
  late AudioRecorder _recorder;
  late AudioPlayer _audioPlayer;
  final ImagePicker _picker = ImagePicker();
  final OfflineQueueService _queue = OfflineQueueService();
  
  bool _isRecording = false;
  bool _isPlaying = false;
  Map<int, String?> _recordedFiles = {}; // Step index -> file path
  Map<String, String?> _capturedImages = {}; // label -> file path
  
  // Data storage
  bool _consentGiven = false;
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _localityController = TextEditingController();
  final TextEditingController _cropController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _recorder = AudioRecorder();
    _audioPlayer = AudioPlayer();
    
    _audioPlayer.onPlayerStateChanged.listen((state) {
      if (mounted) {
        setState(() {
          _isPlaying = state == PlayerState.playing;
        });
      }
    });
  }

  @override
  void dispose() {
    _recorder.dispose();
    _audioPlayer.dispose();
    _pageController.dispose();
    _nameController.dispose();
    _localityController.dispose();
    _cropController.dispose();
    super.dispose();
  }

  Future<void> _takePicture(String label) async {
    final XFile? photo = await _picker.pickImage(source: ImageSource.camera, imageQuality: 70);
    if (photo != null) {
      setState(() {
        _capturedImages[label] = photo.path;
      });
    }
  }

  Future<void> _playRecording(String path) async {
    if (_isPlaying) {
      await _audioPlayer.stop();
    } else {
      Source source = kIsWeb ? UrlSource(path) : DeviceFileSource(path);
      await _audioPlayer.play(source);
    }
  }

  Future<void> _handleRecording() async {
    if (_isRecording) {
      final path = await _recorder.stop();
      setState(() {
        _isRecording = false;
        _recordedFiles[_currentStep] = path;
      });
    } else {
      if (await _recorder.hasPermission()) {
        String? path;
        if (!kIsWeb) {
          final directory = await getApplicationDocumentsDirectory();
          path = '${directory.path}/guided_audio_${_currentStep}_${DateTime.now().millisecondsSinceEpoch}.m4a';
        }
        
        await _recorder.start(const RecordConfig(), path: path ?? '');
        setState(() {
          _isRecording = true;
        });
      }
    }
  }

  void _nextStep() {
    _audioPlayer.stop();
    if (_isRecording) _recorder.stop();
    
    if (_currentStep < 7) {
      _pageController.nextPage(duration: const Duration(milliseconds: 300), curve: Curves.easeInOut);
    } else {
      _finishMission();
    }
  }

  Future<void> _finishMission() async {
    _audioPlayer.stop();
    
    // Create a composite submission in the queue
    // In a real scenario, we might want a 'multi-part' queue entry
    // For now, we'll enqueue each part as a separate entry or a single one with metadata
    
    final taskId = widget.mission['id'];
    final languageId = widget.mission['language'];
    final dialectId = widget.mission['dialect'];
    
    // Save Profile Info as a text entry
    await _queue.enqueue(
      type: 'text',
      taskId: taskId,
      languageId: languageId,
      dialectId: dialectId,
      metadata: {
        'name': _nameController.text,
        'locality': _localityController.text,
        'crop': _cropController.text,
        'is_guided': true,
      }
    );

    // Save All Audios
    for (var entry in _recordedFiles.entries) {
      if (entry.value != null) {
        await _queue.enqueue(
          type: 'audio',
          taskId: taskId,
          filePath: entry.value!,
          languageId: languageId,
          dialectId: dialectId,
          metadata: {'step': entry.key}
        );
      }
    }

    // Save All Images
    for (var entry in _capturedImages.entries) {
      if (entry.value != null) {
        await _queue.enqueue(
          type: 'image',
          taskId: taskId,
          filePath: entry.value!,
          languageId: languageId,
          dialectId: dialectId,
          metadata: {'label': entry.key}
        );
      }
    }

    if (mounted) {
      Navigator.pop(context, true); // Return true to indicate completion
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Mission sauvegardée ! Elle sera synchronisée dès que possible. 🙏'), 
          backgroundColor: Color(0xFF1F7A63)
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text('Mission Terrain', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
        leading: IconButton(icon: const Icon(Icons.close), onPressed: () {
          _audioPlayer.stop();
          Navigator.pop(context);
        }),
      ),
      body: Column(
        children: [
          // Progress bar
          LinearProgressIndicator(
            value: (_currentStep + 1) / 8,
            backgroundColor: const Color(0xFFF0F0F0),
            valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF1F7A63)),
          ),
          Expanded(
            child: PageView(
              controller: _pageController,
              onPageChanged: (v) {
                _audioPlayer.stop();
                setState(() => _currentStep = v);
              },
              physics: const NeverScrollableScrollPhysics(),
              children: [
                _buildStepWelcome(),
                _buildStepConsent(),
                _buildStepBasicInfo(),
                _buildStepAudioPart1(),
                _buildStepAudioPart2(),
                _buildStepAgriculture(),
                _buildStepRepetition(),
                _buildStepClosing(),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(24.0),
        child: ElevatedButton(
          onPressed: (_currentStep == 1 && !_consentGiven) ? null : _nextStep,
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF1F7A63),
            foregroundColor: Colors.white,
            minimumSize: const Size(double.infinity, 56),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          ),
          child: Text(_currentStep == 7 ? 'Terminer' : 'Suivant', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        ),
      ),
    );
  }

  Widget _buildStepWelcome() {
    return _buildStepBase(
      icon: '👋',
      title: 'Accueil',
      content: 'Bonjour !\nNous venons apprendre comment vous travaillez au champ pour mieux aider les agriculteurs.\n\nNous allons :\n• Enregistrer votre voix\n• Prendre quelques photos des plantes\n\nCela servira à créer des outils pour aider les cultivateurs.',
    );
  }

  Widget _buildStepConsent() {
    return _buildStepBase(
      icon: '🤝',
      title: 'Consentement',
      content: 'Est-ce que vous êtes d’accord pour participer ?\nVous pouvez arrêter à tout moment.',
      extra: CheckboxListTile(
        title: const Text('Oui, je consens à participer', style: TextStyle(fontWeight: FontWeight.w600)),
        value: _consentGiven,
        onChanged: (v) => setState(() => _consentGiven = v ?? false),
        activeColor: const Color(0xFF1F7A63),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  Widget _buildStepBasicInfo() {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('📍 Informations de base', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 24),
          _buildField('Nom (optionnel)', _nameController),
          const SizedBox(height: 16),
          _buildField('Localité', _localityController),
          const SizedBox(height: 16),
          _buildField('Culture principale', _cropController),
        ],
      ),
    );
  }

  Widget _buildStepAudioPart1() {
    bool hasRecording = _recordedFiles[_currentStep] != null;
    return _buildStepBase(
      icon: '🎙️',
      title: 'Langue (Audio)',
      content: 'Consigne : Laissez parler librement l\'agriculteur.\n\nQuestions :\n1. Comment vous appelez cette plante ?\n2. Quand elle est malade, comment vous le dites ?',
      action: ElevatedButton.icon(
        onPressed: _handleRecording, 
        icon: Icon(_isRecording ? Icons.stop : (hasRecording ? Icons.check : Icons.mic)), 
        label: Text(_isRecording ? 'Arrêter l\'enregistrement' : (hasRecording ? 'Re-enregistrer' : 'Enregistrer la réponse')),
        style: ElevatedButton.styleFrom(
          backgroundColor: _isRecording ? Colors.red : (hasRecording ? const Color(0xFF1F7A63).withOpacity(0.1) : Colors.red.shade50), 
          foregroundColor: _isRecording ? Colors.white : (hasRecording ? const Color(0xFF1F7A63) : Colors.red)
        ),
      ),
    );
  }

  Widget _buildStepAudioPart2() {
    bool hasRecording = _recordedFiles[_currentStep] != null;
    return _buildStepBase(
      icon: '🎙️',
      title: 'Pratiques Culturelles',
      content: 'Questions :\n3. Explique comment tu travailles ici.\n4. Qu’est-ce qui rend une plante en bonne santé ?',
      action: ElevatedButton.icon(
        onPressed: _handleRecording, 
        icon: Icon(_isRecording ? Icons.stop : (hasRecording ? Icons.check : Icons.mic)), 
        label: Text(_isRecording ? 'Arrêter l\'enregistrement' : (hasRecording ? 'Re-enregistrer' : 'Enregistrer la réponse')),
        style: ElevatedButton.styleFrom(
          backgroundColor: _isRecording ? Colors.red : (hasRecording ? const Color(0xFF1F7A63).withOpacity(0.1) : Colors.red.shade50), 
          foregroundColor: _isRecording ? Colors.white : (hasRecording ? const Color(0xFF1F7A63) : Colors.red)
        ),
      ),
    );
  }

  Widget _buildStepAgriculture() {
    return _buildStepBase(
      icon: '📸',
      title: 'Agriculture (Images)',
      content: 'Prendre des photos et demander des explications :\n• Plante en bonne santé\n• Plante malade\n• Qu’est-ce qui ne va pas ici ?',
      action: Row(
        children: [
          Expanded(child: _buildSmallImageAction('Saine', Icons.check_circle_outline)),
          const SizedBox(width: 8),
          Expanded(child: _buildSmallImageAction('Malade', Icons.error_outline)),
          const SizedBox(width: 8),
          Expanded(child: _buildSmallImageAction('Autre', Icons.camera_alt_outlined)),
        ],
      ),
    );
  }

  Widget _buildStepRepetition() {
    bool hasRecording = _recordedFiles[_currentStep] != null;
    return _buildStepBase(
      icon: '🗣️',
      title: 'Répétition',
      content: 'Demandez de répéter ces phrases :\n\n• “Mon cacao est malade”\n• “Les feuilles sont jaunes”\n• “La plante est en bonne santé”',
      action: ElevatedButton.icon(
        onPressed: _handleRecording, 
        icon: Icon(_isRecording ? Icons.stop : (hasRecording ? Icons.check : Icons.mic)), 
        label: Text(_isRecording ? 'Arrêter l\'enregistrement' : (hasRecording ? 'Re-enregistrer' : 'Enregistrer les répétitions')),
        style: ElevatedButton.styleFrom(
          backgroundColor: _isRecording ? Colors.red : (hasRecording ? const Color(0xFF1F7A63).withOpacity(0.1) : Colors.red.shade50), 
          foregroundColor: _isRecording ? Colors.white : (hasRecording ? const Color(0xFF1F7A63) : Colors.red)
        ),
      ),
    );
  }

  Widget _buildStepClosing() {
    return _buildStepBase(
      icon: '🙏',
      title: 'Clôture',
      content: 'Merci beaucoup !\nVos réponses vont aider d’autres agriculteurs.\n\nLa mission est terminée.',
    );
  }

  // UI Helpers
  Widget _buildStepBase({required String icon, required String title, required String content, Widget? extra, Widget? action}) {
    String? audioPath = _recordedFiles[_currentStep];
    
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(icon, style: const TextStyle(fontSize: 48)),
          const SizedBox(height: 16),
          Text(title, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
          const SizedBox(height: 24),
          Text(content, style: const TextStyle(fontSize: 18, height: 1.6, color: Colors.black87)),
          
          if (audioPath != null) ...[
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFF1F7A63).withOpacity(0.05),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF1F7A63).withOpacity(0.1)),
              ),
              child: Row(
                children: [
                  IconButton(
                    onPressed: () => _playRecording(audioPath),
                    icon: Icon(_isPlaying ? Icons.stop_circle : Icons.play_circle, color: const Color(0xFF1F7A63), size: 32),
                  ),
                  const Expanded(
                    child: Text('Enregistrement capturé', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  ),
                  TextButton(
                    onPressed: () => setState(() => _recordedFiles[_currentStep] = null),
                    child: const Text('Effacer', style: TextStyle(color: Colors.red, fontSize: 12)),
                  ),
                ],
              ),
            ),
          ],
          
          if (extra != null) ...[const SizedBox(height: 32), extra],
          const Spacer(),
          if (action != null) action,
        ],
      ),
    );
  }

  Widget _buildField(String label, TextEditingController controller) {
    return TextField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        filled: true,
        fillColor: Colors.grey.shade50,
      ),
    );
  }

  Widget _buildSmallImageAction(String label, IconData icon) {
    String? path = _capturedImages[label];
    bool hasImage = path != null;

    return ElevatedButton(
      onPressed: () => _takePicture(label),
      style: ElevatedButton.styleFrom(
        backgroundColor: hasImage ? const Color(0xFF1F7A63).withOpacity(0.1) : Colors.grey.shade100,
        foregroundColor: hasImage ? const Color(0xFF1F7A63) : Colors.black87,
        elevation: 0,
        padding: const EdgeInsets.symmetric(vertical: 12),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      child: Column(
        children: [
          if (hasImage) 
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: kIsWeb 
                ? Image.network(path, height: 30, width: 30, fit: BoxFit.cover)
                : Image.file(io.File(path), height: 30, width: 30, fit: BoxFit.cover),
            )
          else
            Icon(icon, size: 24),
          const SizedBox(height: 4),
          Text(label, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
