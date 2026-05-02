class QualityEngine:
    """
    NYANSA Quality Scoring Engine
    Analyzes clarity and relevance of submissions.
    """

    @staticmethod
    def evaluate_audio(entry):
        """Basic audio quality check (e.g., volume, silence ratio)."""
        # Placeholder: 0.8 as baseline for "audible"
        return 0.8

    @staticmethod
    def evaluate_text(entry):
        """Checks for length, grammar, and relevance."""
        text = entry.content_text or ""
        if len(text) < 10:
            return 0.2
        if len(text) > 50:
            return 0.9
        return 0.7

    @classmethod
    def score_entry(cls, entry):
        """Main entry point for quality evaluation."""
        task_type = entry.task.task_type if entry.task else 'audio'
        
        # Audio Quality (Noise, silence, clarity)
        if task_type == 'audio' or entry.audio_file:
            entry.audio_score = cls.evaluate_audio(entry)
        
        # Linguistic Quality (Grammar, vocabulary, relevance)
        if entry.content_text:
            entry.linguistic_score = cls.evaluate_text(entry)
        else:
            # Baseline for non-text tasks or initial audio scoring
            entry.linguistic_score = 0.5
            
        # Dialect Consistency (Is it the right region?)
        if entry.dialect:
            # Placeholder: Higher priority dialects might get a slight boost or baseline
            entry.dialect_score = 0.7 + (entry.dialect.priority * 0.05)
        else:
            entry.dialect_score = 0.5

        # Diversity (Contextual variety)
        entry.diversity_score = 0.6 # Placeholder
        
        # Legacy support
        entry.quality_score = (entry.audio_score + entry.linguistic_score) / 2
        
        entry.save()
        return entry.final_score
