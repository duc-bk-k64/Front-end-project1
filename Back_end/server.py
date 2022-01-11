import io
from PIL import Image
from flask import Flask
from flask_cors import CORS, cross_origin
from flask import request
from flask import json
import numpy as np
import cv2
import base64
import tensorflow as tf
from keras.preprocessing import image

sess = tf.compat.v1.Session()
graph = tf.compat.v1.get_default_graph()

with sess.as_default():
    with graph.as_default():
        model = tf.keras.models.load_model('batchProject1VGG16.h5')

app = Flask(__name__)
# Apply Flask CORS
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
class_names = ['Apple', 'Banana', 'Broccoli', 'Carrots', 'Cauliflower', 'Chili', 'Coconut', 'Cucumber', 'Custard apple',
               'Dates', 'Dragon', 'Egg', 'Garlic', 'Grape', 'Green Lemon', 'Jackfruit', 'Kiwi', 'Mango', 'Okra',
               'Onion', 'Orange', 'Papaya', 'Peanut', 'Pineapple', 'Pomegranate', 'Star Fruit', 'Strawberry',
               'Sweet Potato', 'Watermelon', 'White Mushroom']

def convert_base64_to_image(anh_base64):
    try:
        imgdata = base64.b64decode(str(anh_base64))
        image = Image.open(io.BytesIO(imgdata))

        # return cv2.cvtColor(np.array(image), cv2.COLOR_BGR2RGB)
        return np.asarray(image)

    except:
        return None


@app.route('/process', methods=['POST'])
@cross_origin(origin='*')
def process():
    try:
        # get data from client
        data = request.get_json()
        image64 = data.get('file', '')
        # convert image from base 64 to opencv format
        images = convert_base64_to_image(image64)
        images = cv2.resize(images, (224, 224), interpolation=cv2.INTER_AREA)
        # predict label
        img_tensor = image.img_to_array(images)
        img_tensor = np.expand_dims(img_tensor, axis=0)
        with sess.as_default():
            with graph.as_default():
                score = model.predict(img_tensor)
        result = np.max(score)

        if result > 0.6:
            response = {
                'label': (class_names[np.argmax(score)] + ' Probability:' + str(int(100 * np.max(score))) + '%')
            }
            return json.dumps(response)

        else:
            response = {
                'label': 'Unknown label'
            }
            return json.dumps(response)

    except Exception as e:
        print(str(e))


if __name__ == '__main__':
    app.run(host="0.0.0.0", port="6868")
