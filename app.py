from flask import Flask, request, jsonify, send_from_directory, render_template
import os
from detector import run_detection

app = Flask(__name__)
UPLOAD_DIR = 'uploads'
RESULT_DIR = 'results'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    video = request.files['video']
    top_color = request.form.get('topColor', 'black')
    bottom_color = request.form.get('bottomColor', 'black')

    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)
    if not os.path.exists(RESULT_DIR):
        os.makedirs(RESULT_DIR)

    video_path = os.path.join(UPLOAD_DIR, 'uploaded_video.mp4')
    video.save(video_path)

    results = run_detection(video_path, top_color, bottom_color, RESULT_DIR)
    return jsonify({'images': results})

@app.route('/results/<filename>')
def get_result_image(filename):
    return send_from_directory(RESULT_DIR, filename)

if __name__ == '__main__':
    app.run(debug=True)
