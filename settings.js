String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param

    var minutes = Math.floor((sec_num - (Math.floor(sec_num / 3600) * 3600)) / 60);
    var seconds = sec_num - (Math.floor(sec_num / 3600) * 3600) - (minutes * 60);

    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return (minutes=="00"? '' : minutes + 'm. ') + seconds+'s.';
}

function initListeners(){
    document.getElementById('refreshRate').addEventListener("input", function(e){
        document.getElementById('refreshRateLabel').innerHTML = (e.target.value).toString().toHHMMSS();
    });
    document.getElementById('volume').addEventListener("input", function(e){
        document.getElementById('volumeLabel').innerHTML = (e.target.value).toString()+"%";
    });

    document.getElementById('notification_disable').addEventListener("input", function(e){
       document.getElementById('notification_sound').setAttribute("disabled", "disabled");
        document.querySelector("#notification_sound").checked = false;
            document.getElementById('sound_settings').style.display = "none"; 
    });

    document.getElementById('notification_enable').addEventListener("input", function(e){
        document.getElementById('notification_sound').removeAttribute('disabled')
    });

    document.getElementById('notification_sound_default').addEventListener("input", function(e){
       document.getElementById('notification_sound_file').setAttribute("disabled", "disabled");
    });

    document.getElementById('notification_sound_own').addEventListener("input", function(e){
        document.getElementById('notification_sound_file').removeAttribute('disabled')
    });

    document.getElementById('notification_sound').addEventListener("input", function(e) {
        if (e.target.checked) {
            document.getElementById('sound_settings').style.display = "block"; 
        } else {
            document.getElementById('sound_settings').style.display = "none"; 
        }
    });
    document.querySelector("form").addEventListener("submit", saveOptions);
}

function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    notification_sound_default: document.querySelector("#notification_sound_default").checked,
    notification_sound: document.querySelector("#notification_sound").checked,
    volume: document.querySelector("#volume").value,
    refresh_rate: document.querySelector("#refreshRate").value,
    notification_enable: document.querySelector("#notification_enable").checked
  });
    var file = document.querySelector('input[type="file"]').files[0];
        getBase64(file).then(
            data => { 
                browser.storage.sync.set({  notification_sound_file: data });
             }   
        );
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
document.addEventListener('DOMContentLoaded',function() {
    initListeners();
    var getting = browser.storage.sync.get();
    getting.then(function(data){
        console.log("SETTINGS notification_sound_default",data.notification_sound_default);        
        if(data.notification_sound_default){ document.querySelector("#notification_sound_default").checked=true; } else { document.querySelector("#notification_sound_own").checked=true;}
        if(data.notification_sound){ document.querySelector("#notification_sound").checked = true; }else{ document.querySelector("#notification_sound").checked = false;}
        document.querySelector("#volume").value = data.volume;
        document.querySelector("#refreshRate").value = data.refresh_rate;
        if(data.notification_enable) { document.querySelector("#notification_enable").checked=true; }else{ document.querySelector("#notification_disable").checked = true;}

        document.getElementById('refreshRateLabel').innerHTML = (document.getElementById('refreshRate').value).toString().toHHMMSS();
        document.getElementById('volumeLabel').innerHTML = (document.getElementById('volume').value).toString()+"%";

        if (data.notification_sound_default) {
            document.getElementById('notification_sound_file').setAttribute("disabled", "disabled");
        }

        if (data.notification_sound) {

            document.getElementById('sound_settings').style.display = "block"; 
        }

    });

   
});

function onChange(toggle){
        console.log(toggle);
        if (toggle.checked) {
            $(toggle).parent('.toggle-switch').parent().addClass('active');
        } else {
            $(toggle).parent('.toggle-switch').parent().removeClass('active');
        }
}

