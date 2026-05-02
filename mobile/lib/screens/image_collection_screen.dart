import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import '../core/queue_service.dart';
import '../core/sync_manager.dart';

class ImageCollectionScreen extends StatefulWidget {
  final int taskId;
  final String taskTitle;
  const ImageCollectionScreen({super.key, required this.taskId, required this.taskTitle});

  @override
  State<ImageCollectionScreen> createState() => _ImageCollectionScreenState();
}

class _ImageCollectionScreenState extends State<ImageCollectionScreen> {
  File? _capturedImage;
  bool _isSaving = false;
  final OfflineQueueService _queue = OfflineQueueService();
  final ImagePicker _picker = ImagePicker();

  Future<void> _captureImage() async {
    // Camera ONLY - not gallery (as per spec)
    final XFile? photo = await _picker.pickImage(
      source: ImageSource.camera,
      imageQuality: 70, // Automatic compression
      maxWidth: 1280,
      maxHeight: 1280,
    );

    if (photo != null) {
      setState(() => _capturedImage = File(photo.path));
    }
  }

  Future<void> _saveToQueue() async {
    if (_capturedImage == null) return;
    setState(() => _isSaving = true);

    final deviceId = await FraudGuard.getDeviceId();
    await _queue.enqueue(
      type: 'image',
      taskId: widget.taskId,
      filePath: _capturedImage!.path,
      deviceId: deviceId,
    );

    setState(() => _isSaving = false);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('✅ Image mise en file de synchronisation !'), backgroundColor: Color(0xFF1F7A63)),
      );
      Navigator.pop(context, true);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: Text(widget.taskTitle, style: const TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          Expanded(
            child: _capturedImage == null
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.camera_alt, size: 80, color: Colors.white38),
                        const SizedBox(height: 16),
                        const Text('Aucune photo capturée',
                            style: TextStyle(color: Colors.white54, fontSize: 16)),
                        const SizedBox(height: 8),
                        const Text('Utilisation de la caméra uniquement\n(pas de galerie)',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.white38, fontSize: 13)),
                      ],
                    ),
                  )
                : Stack(
                    children: [
                      Positioned.fill(
                        child: Image.file(_capturedImage!, fit: BoxFit.contain),
                      ),
                      Positioned(
                        top: 12,
                        right: 12,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.black54,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.compress, size: 14, color: Colors.white),
                              const SizedBox(width: 4),
                              Text(
                                '${(_capturedImage!.lengthSync() / 1024).toStringAsFixed(0)} KB (compressé)',
                                style: const TextStyle(color: Colors.white, fontSize: 12),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
          ),
          // Bottom bar
          Container(
            color: Colors.black,
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _captureImage,
                    icon: const Icon(Icons.camera_alt, color: Colors.white),
                    label: Text(_capturedImage == null ? 'Prendre une photo' : 'Reprendre',
                        style: const TextStyle(color: Colors.white)),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Colors.white38),
                      padding: const EdgeInsets.all(14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
                if (_capturedImage != null) ...[
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: _isSaving ? null : _saveToQueue,
                      icon: _isSaving
                          ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                          : const Icon(Icons.upload),
                      label: Text(_isSaving ? 'Enregistrement...' : 'Soumettre'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1F7A63),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.all(14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
