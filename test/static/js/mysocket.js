document.write('<script src="js/socket.io.min.js"></script>');
var baseUrl = 'http://192.168.8.182:5050';

function createConn(actId) {
    var socket = io(baseUrl + '/' + actId);
    var disconnectFlag = false;

    function showAlert() {
        if (disconnectFlag) {
            alert("Network disconnected!");
        }
    }

    socket.on('connect', function () {
        console.log('connect:' + new Date());
        disconnectFlag = false;
    });

    socket.on('disconnect', function () {
        console.log('disconnect:' + new Date());
        disconnectFlag = true;
        setTimeout(function () {
            showAlert();
        }, 10000);
    });

    socket.on('heartbeat', function () {
        console.log('heartbeat');
    });
    setupEvent(socket);
}
function setupEvent(socket) {
    console.log("start setupEvent...");
}






