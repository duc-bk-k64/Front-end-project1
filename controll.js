 
  function Base64() {
    validImageTypes = ['image/jpeg','image/png'];
    var file = document.querySelector(
      'input[type=file]')['files'][0];
     if(file.length===0) {
       alert('Please select image file');
     }
     else if(!validImageTypes.includes(file['type'])) {
       alert('Please select valid image file');

     }
     else {
        return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
        if ((encoded.length % 4) > 0) {
          encoded += '='.repeat(4 - (encoded.length % 4));
        }
        resolve(encoded);
      };
      reader.onerror = error => reject(error);
    });
     
  }
  } 
var run = function() {
  Base64().then(data => {
    loadDoc(data,"label")
  })

}  
var loadDoc = function(data,labelid) {
  var formData = {
    file: data
  }
 
  fetch('http://192.168.1.6:6868/process', { // Your POST endpoint
  method: 'POST',
  headers: {
    // Content-Type may need to be completely **omitted**
    // or you may need something
    "Content-Type": "application/json"
  },
  body:JSON.stringify(formData)
})
  .then(function(response) {
    return response.json();
  })
  .then(function(labels) {
    try {
      // var obj=JSON.parse(labels);
      console.log(labels);
       document.getElementById(labelid).innerHTML =labels.label;
    } catch (error) {
      console.log(error);
    }
   
  
})
  .catch(function(err) {
  console.log(err);
})

}

  var loadFile = function(event) {
    var image = document.getElementById('image');
    image.src = URL.createObjectURL(event.target.files[0]);
    document.getElementById("label").innerHTML ="";
  }
let camera_button = document.querySelector("#start-camera");
let video = document.querySelector("#video");
let click_button = document.querySelector("#click-photo");
let canvas = document.querySelector("#canvas");
let image_data_url;
let stream;
camera_button.addEventListener('click', async function() {
   	 stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
	video.srcObject = stream;
});

click_button.addEventListener('click', function() {
   	canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    image_data_url = canvas.toDataURL('image/jpeg');

   	// data url of the image
   	console.log(image_data_url);
     document.getElementById("labelcamera").innerHTML="";
});
let predictions = document.querySelector("#predict");
let stop_camera = document.querySelector("#stop-camera");
predict.addEventListener('click',function(){
     
     array=image_data_url.split(',');
     data=array[1];
     loadDoc(data,"labelcamera");
     
});
stop_camera.addEventListener('click',function(){
  stream.getTracks().forEach(track => track.stop())
});