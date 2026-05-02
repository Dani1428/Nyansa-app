import 'package:flutter/material.dart';
import '../core/queue_service.dart';
import '../core/sync_manager.dart';

const List<Map<String, String>> _languages = [
  {'code': 'sw', 'label': 'Swahili'},
  {'code': 'wo', 'label': 'Wolof'},
  {'code': 'ha', 'label': 'Hausa'},
  {'code': 'yo', 'label': 'Yoruba'},
  {'code': 'am', 'label': 'Amharique'},
  {'code': 'so', 'label': 'Somali'},
  {'code': 'fr', 'label': 'Français'},
];

class TextCollectionScreen extends StatefulWidget {
  final int taskId;
  final String taskTitle;
  const TextCollectionScreen({super.key, required this.taskId, required this.taskTitle});

  @override
  State<TextCollectionScreen> createState() => _TextCollectionScreenState();
}

class _TextCollectionScreenState extends State<TextCollectionScreen> {
  final TextEditingController _textController = TextEditingController();
  String? _selectedLanguage;
  bool _isSaving = false;
  final OfflineQueueService _queue = OfflineQueueService();

  int get _wordCount => _textController.text.trim().isEmpty
      ? 0
      : _textController.text.trim().split(RegExp(r'\s+')).length;

  bool get _isValid => _selectedLanguage != null && _textController.text.trim().length >= 10;

  Future<void> _saveToQueue() async {
    if (!_isValid) return;
    setState(() => _isSaving = true);

    final deviceId = await FraudGuard.getDeviceId();
    await _queue.enqueue(
      type: 'text',
      taskId: widget.taskId,
      contentText: '${_selectedLanguage}::${_textController.text.trim()}',
      deviceId: deviceId,
    );

    setState(() => _isSaving = false);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('✅ Texte mis en file de synchronisation !'),
          backgroundColor: Color(0xFF1F7A63),
        ),
      );
      Navigator.pop(context, true);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        title: Text(widget.taskTitle, style: const TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Language selector (REQUIRED)
            const Text('Langue *', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: _selectedLanguage == null ? Colors.orange.shade300 : const Color(0xFF1F7A63),
                  width: 1.5,
                ),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _selectedLanguage,
                  hint: const Text('Sélectionnez la langue (obligatoire)'),
                  isExpanded: true,
                  items: _languages.map((lang) => DropdownMenuItem(
                    value: lang['code'],
                    child: Text(lang['label']!),
                  )).toList(),
                  onChanged: (val) => setState(() => _selectedLanguage = val),
                ),
              ),
            ),
            if (_selectedLanguage == null)
              const Padding(
                padding: EdgeInsets.only(top: 4, left: 4),
                child: Text('La langue est obligatoire', style: TextStyle(color: Colors.orange, fontSize: 12)),
              ),

            const SizedBox(height: 20),

            // Text input
            const Text('Transcription *', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(height: 8),
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: TextField(
                controller: _textController,
                maxLines: 8,
                onChanged: (_) => setState(() {}),
                decoration: const InputDecoration(
                  hintText: 'Saisissez la transcription ici...',
                  contentPadding: EdgeInsets.all(16),
                  border: InputBorder.none,
                ),
              ),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '$_wordCount mots · ${_textController.text.length} caractères',
                  style: TextStyle(color: Colors.grey.shade500, fontSize: 12),
                ),
                if (_textController.text.trim().length < 10 && _textController.text.isNotEmpty)
                  const Text('Minimum 10 caractères', style: TextStyle(color: Colors.orange, fontSize: 12)),
              ],
            ),

            const SizedBox(height: 24),

            // Quality tips
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFF1F7A63).withOpacity(0.05),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFF1F7A63).withOpacity(0.2)),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Conseils qualité', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF1F7A63))),
                  SizedBox(height: 4),
                  Text('• Vérifiez l\'orthographe dans la langue sélectionnée\n• Soyez précis et complet\n• Évitez les abréviations',
                      style: TextStyle(fontSize: 12, color: Colors.black54)),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Submit button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: (_isValid && !_isSaving) ? _saveToQueue : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1F7A63),
                  foregroundColor: Colors.white,
                  disabledBackgroundColor: Colors.grey.shade300,
                  padding: const EdgeInsets.all(16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: _isSaving
                    ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Text('Soumettre la transcription', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
