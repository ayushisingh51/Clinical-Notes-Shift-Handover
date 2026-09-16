const transcribeAudio = async (audioPath) => {
  if (!audioPath) {
    throw new Error("Audio file path is required");
  }

  // Transcription provider will be connected here later.
  throw new Error(
    "Transcription service is not configured yet. Please add a speech-to-text provider."
  );
};

module.exports = {
  transcribeAudio,
};