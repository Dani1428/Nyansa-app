from celery import shared_task
from datasets.models import DataEntry
from core.models import Profile
import time

@shared_task
def process_submission_task(entry_id):
    """
    Background task to validate submissions and update gamification stats.
    """
    try:
        # Give it a small delay to simulate processing
        time.sleep(2) 
        
        entry = DataEntry.objects.select_related('annotator', 'task').get(id=entry_id)
        
        # Simple AI Validation Simulation
        # In production, call actual AI models (Audio transcription, Image classification)
        is_valid = True
        flags = []
        
        if not entry.gps_lat or not entry.gps_long:
            is_valid = False
            flags.append('missing_gps')
            
        if entry.task.task_type == 'audio' and (not entry.audio_file and not entry.file_url):
            is_valid = False
            flags.append('missing_media')

        if is_valid:
            entry.status = 'approved'
            entry.quality_score = 0.9 + (time.time() % 0.1) # Simulate high quality
            
            # --- Gamification Update ---
            profile = entry.annotator
            if profile:
                # Add points (10 per entry)
                profile.points += 10
                
                # Add to balance
                if entry.task and entry.task.reward_per_entry:
                    profile.balance += entry.task.reward_per_entry
                
                # Level Up Logic (1000 points per level)
                new_level = (profile.points // 1000) + 1
                if new_level > profile.level:
                    profile.level = new_level
                
                profile.save()
        else:
            entry.status = 'rejected'
            entry.fraud_flags = flags
            
        entry.save()
        return f"Submission {entry_id} processed. Status: {entry.status}"
        
    except DataEntry.DoesNotExist:
        return f"Error: DataEntry {entry_id} not found."
    except Exception as e:
        return f"Error processing {entry_id}: {str(e)}"
