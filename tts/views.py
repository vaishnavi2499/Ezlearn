import torch
from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse
from TTS.api import TTS
from pydub import AudioSegment
import os
import fitz  # For PDF processing
import pytesseract  # For image OCR
from PIL import Image
from django.core.files.storage import FileSystemStorage  # Import this for handling file uploads

# Path to your saved model
model_path = r"C:\Users\VAISHNAVI\OneDrive\Desktop\dysproj\dys_pro\saved_models\coqui_tts_model.pth"

# Initialize the TTS instance
tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
state_dict = torch.load(model_path, weights_only=True)
tts.load_state_dict(state_dict)

tts.eval()

def extract_text_from_pdf(pdf_path):
    """Extracts text from a PDF file."""
    text = ""
    try:
        pdf_document = fitz.open(pdf_path)
        for page_num in range(pdf_document.page_count):
            page = pdf_document[page_num]
            text += page.get_text()
        pdf_document.close()
    except Exception as e:
        print(f"Error reading PDF: {e}")
    return text

def extract_text_from_image(image_path):
    """Extracts text from an image using OCR."""
    try:
        image = Image.open(image_path)
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        print(f"Error reading image: {e}")
        return ""

# Define the view for TTS
def text_to_speech(request):
    if request.method == "POST":
        text = request.POST.get("text", "").lower()  # Text from textbox

        # Handle PDF upload
        if request.FILES.get('pdf'):
            pdf_file = request.FILES['pdf']
            fs = FileSystemStorage()
            pdf_filename = fs.save(pdf_file.name, pdf_file)
            pdf_path = fs.path(pdf_filename)
            text += extract_text_from_pdf(pdf_path)

        # Handle image upload
        if request.FILES.get('image'):
            image_file = request.FILES['image']
            fs = FileSystemStorage()
            image_filename = fs.save(image_file.name, image_file)
            image_path = fs.path(image_filename)
            text += extract_text_from_image(image_path)

        # If no text, PDF, or image was provided
        if not text:
            return JsonResponse({"error": "No text, PDF, or image provided."})

        # Use MEDIA_ROOT for file paths
        wav_file_path = os.path.join(settings.MEDIA_ROOT, "output.wav")
        mp3_file_path = os.path.join(settings.MEDIA_ROOT, "output.mp3")

        try:
            # Convert text to speech and save it as a WAV file
            tts.tts_to_file(text=text, speaker="Claribel Dervla", language="en", file_path=wav_file_path)

            # Ensure ffmpeg is correctly configured
            AudioSegment.converter = r"C:\Users\VAISHNAVI\Downloads\ffmpeg-2024-10-02-git-358fdf3083-full_build\ffmpeg-2024-10-02-git-358fdf3083-full_build\bin\ffmpeg.exe"

            # Convert WAV to MP3 using pydub
            sound = AudioSegment.from_wav(wav_file_path)
            sound = sound.set_frame_rate(48000)
            sound = sound.set_channels(2)
            sound = sound.apply_gain(-sound.max_dBFS)
            sound.export(mp3_file_path, format="mp3", bitrate="192k")

            # Return the MP3 file's URL as the response
            audio_url = f"{settings.MEDIA_URL}output.mp3"
            return JsonResponse({"audio_url": audio_url})

        except Exception as e:
            print("Error generating audio:", e)
            return JsonResponse({"error": "An error occurred while generating audio."})

    return render(request, 'ttts.html')
