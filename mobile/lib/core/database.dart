import 'package:drift/drift.dart';

part 'database.g.dart';

class Missions extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get title => text().withLength(min: 1, max: 255)();
  TextColumn get description => text()();
  TextColumn get taskType => text()(); // audio, image, text
  RealColumn get reward => real()();
  BoolColumn get isSynced => boolean().withDefault(const Constant(false))();
}

class Submissions extends Table {
  IntColumn get id => integer().autoIncrement()();
  IntColumn get taskId => integer()();
  TextColumn get content => text().nullable()();
  TextColumn get filePath => text().nullable()();
  RealColumn get gpsLat => real().nullable()();
  RealColumn get gpsLong => real().nullable()();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  BoolColumn get isSynced => boolean().withDefault(const Constant(false))();
}

@DriftDatabase(tables: [Missions, Submissions])
class AppDatabase extends _$AppDatabase {
  AppDatabase(QueryExecutor e) : super(e);

  @override
  int get schemaVersion => 1;
}
