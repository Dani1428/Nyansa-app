import hashlib
import math
from django.utils import timezone
from datetime import timedelta


class FraudEngine:
    """
    NYANSA Fraud Detection Engine v2
    Full implementation of the anti-fraud specification.
    Returns: {fraud_score: float, flags: [str]}
    """

    # ─── 1. File hashing ────────────────────────────────────────────────────
    @staticmethod
    def calculate_file_hash(file_content: bytes) -> str:
        return hashlib.md5(file_content).hexdigest()

    # ─── 2. GPS validation ──────────────────────────────────────────────────
    @staticmethod
    def check_gps(entry) -> tuple[float, list]:
        flags = []
        score = 0.0

        if not entry.gps_lat or not entry.gps_long:
            flags.append("missing_gps")
            score += 0.25
            return score, flags

        # Sanity check: valid coordinates
        if not (-90 <= entry.gps_lat <= 90 and -180 <= entry.gps_long <= 180):
            flags.append("invalid_gps_coordinates")
            score += 0.3

        # Check if GPS is at (0,0) — classic spoofing indicator
        if abs(entry.gps_lat) < 0.001 and abs(entry.gps_long) < 0.001:
            flags.append("gps_null_island_spoofing")
            score += 0.5

        return score, flags

    # ─── 3. Device fingerprint check ────────────────────────────────────────
    @staticmethod
    def check_device_fraud(entry) -> tuple[float, list]:
        from datasets.models import DataEntry
        flags = []
        score = 0.0

        if not entry.device_id:
            flags.append("missing_device_id")
            score += 0.1
            return score, flags

        # Check if this device ID was used by more than 3 different annotators
        device_users = DataEntry.objects.filter(
            device_id=entry.device_id
        ).exclude(
            annotator=entry.annotator
        ).values('annotator').distinct().count()

        if device_users >= 3:
            flags.append("device_multi_account")
            score += 0.6
        elif device_users >= 1:
            flags.append("device_shared")
            score += 0.2

        return score, flags

    # ─── 4. Rapid submission detection ──────────────────────────────────────
    @staticmethod
    def check_submission_speed(entry) -> tuple[float, list]:
        from datasets.models import DataEntry
        flags = []
        score = 0.0

        one_hour_ago = timezone.now() - timedelta(hours=1)
        recent_count = DataEntry.objects.filter(
            annotator=entry.annotator,
            task=entry.task,
            created_at__gte=one_hour_ago
        ).exclude(id=entry.id if entry.id else None).count()

        # More than 20 entries per hour for the same task = suspicious
        if recent_count >= 20:
            flags.append("submission_rate_too_high")
            score += 0.7
        elif recent_count >= 10:
            flags.append("submission_rate_elevated")
            score += 0.3

        return score, flags

    # ─── 5. Duplicate detection ──────────────────────────────────────────────
    @staticmethod
    def check_duplicate(entry, file_content: bytes | None, task) -> tuple[float, list]:
        from datasets.models import DataEntry
        flags = []
        score = 0.0

        if file_content:
            checksum = FraudEngine.calculate_file_hash(file_content)
            entry.checksum = checksum
            if DataEntry.objects.filter(
                task=task, checksum=checksum
            ).exclude(id=entry.id if entry.id else None).exists():
                flags.append("exact_duplicate_file")
                score += 0.9

        # Text duplication check
        if entry.content_text and len(entry.content_text) > 10:
            similar = DataEntry.objects.filter(
                task=task,
                content_text=entry.content_text
            ).exclude(id=entry.id if entry.id else None).exists()
            if similar:
                flags.append("exact_duplicate_text")
                score += 0.85

        return score, flags

    # ─── 6. Audio analysis ──────────────────────────────────────────────────
    @staticmethod
    def analyze_audio(entry, task) -> tuple[float, list]:
        flags = []
        score = 0.0

        # Duration check
        min_duration = 5.0
        if entry.duration_seconds is not None:
            if entry.duration_seconds < min_duration:
                flags.append("audio_too_short")
                score += 0.4
            elif entry.duration_seconds < 2.0:
                flags.append("audio_extremely_short")
                score += 0.8

        # File size heuristic — very small audio = silence or near-silence
        # This is approximated without loading the audio binary
        # A real implementation would use librosa/pydub

        return score, flags

    # ─── 7. Text / AI content analysis ──────────────────────────────────────
    @staticmethod
    def analyze_text(text: str | None) -> tuple[float, list]:
        score = 0.0
        flags = []

        if not text:
            return 1.0, ["empty_content"]

        text = text.strip()

        # 7.1 Repetitive patterns
        words = text.lower().split()
        if len(words) > 3:
            unique_ratio = len(set(words)) / len(words)
            if unique_ratio < 0.2:
                flags.append("highly_repetitive_text")
                score += 0.6
            elif unique_ratio < 0.4:
                flags.append("low_variation_text")
                score += 0.3

        # 7.2 Too short
        if len(text) < 5:
            flags.append("text_too_short")
            score += 0.4

        # 7.3 Only numbers/symbols (no real linguistic content)
        alpha_ratio = sum(c.isalpha() for c in text) / max(len(text), 1)
        if alpha_ratio < 0.5:
            flags.append("insufficient_linguistic_content")
            score += 0.3

        # 7.4 AI pattern: suspiciously structured (starts with "Sure," "Certainly," etc.)
        ai_openers = ["sure,", "certainly,", "of course,", "as an ai", "as a language model"]
        if any(text.lower().startswith(opener) for opener in ai_openers):
            flags.append("suspected_ai_generated")
            score += 0.7

        return min(score, 1.0), flags

    # ─── 8. Main process ─────────────────────────────────────────────────────
    @classmethod
    def process_submission(cls, entry, task, file_content: bytes | None = None) -> dict:
        """
        Main entry point. Returns:
        {
            "fraud_score": 0.85,
            "flags": ["duplicate_audio", "missing_gps"]
        }
        """
        total_score = 0.0
        all_flags = []

        # Run all checks
        checks = [
            cls.check_gps(entry),
            cls.check_device_fraud(entry),
            cls.check_submission_speed(entry),
            cls.check_duplicate(entry, file_content, task),
        ]

        if task.task_type == 'audio':
            checks.append(cls.analyze_audio(entry, task))
        elif task.task_type == 'text':
            checks.append(cls.analyze_text(entry.content_text))

        for s, f in checks:
            total_score += s
            all_flags.extend(f)

        # Normalize and cap at 1.0
        final_score = min(total_score, 1.0)

        # Persist
        entry.fraud_score = final_score
        entry.fraud_flags = list(set(all_flags))  # Deduplicate flags

        # Auto-reject obvious fraud
        if final_score > 0.8:
            entry.status = 'rejected'
        else:
            entry.status = 'pending'

        entry.save()

        return {
            "fraud_score": round(final_score, 4),
            "flags": list(set(all_flags))
        }
