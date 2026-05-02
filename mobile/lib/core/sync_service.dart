import 'database.dart';
import 'api_service.dart';

class SyncService {
  final AppDatabase db;
  final ApiService api;

  SyncService(this.db, this.api);

  Future<void> syncSubmissions() async {
    // 1. Fetch unsynced submissions from local DB
    final unsynced = await (db.select(db.submissions)..where((t) => t.isSynced.equals(false))).get();

    for (var sub in unsynced) {
      try {
        final success = await api.uploadSubmission({
          'task_id': sub.taskId,
          'content_text': sub.content,
          'gps_lat': sub.gpsLat,
          'gps_long': sub.gpsLong,
          'device_id': 'mobile_device_id', // Would be dynamic in production
        }, sub.filePath);

        if (success) {
          // 2. Mark as synced in local DB
          await (db.update(db.submissions)..where((t) => t.id.equals(sub.id)))
              .write(const SubmissionsCompanion(isSynced: Value(true)));
        }
      } catch (e) {
        print('Failed to sync submission ${sub.id}: $e');
      }
    }
  }

  Future<void> refreshMissions() async {
    try {
      final missions = await api.fetchMissions();
      // Clear and update local missions
      await db.delete(db.missions).go();
      for (var m in missions) {
        await db.into(db.missions).insert(MissionsCompanion.insert(
          title: m['title'],
          description: m['description'],
          taskType: m['task_type'],
          reward: double.parse(m['reward_per_entry'].toString()),
          isSynced: const Value(true),
        ));
      }
    } catch (e) {
      print('Failed to refresh missions: $e');
    }
  }
}
