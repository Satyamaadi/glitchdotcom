// Get the modal
var modal = document.getElementById("myModal");
var dModal = document.getElementById("dModal");
var edeta = document.getElementById("edeta");
var e1 = document.getElementById("e1");
var e2 = document.getElementById("e2");
var e3 = document.getElementById("e3");
// Get the button that opens the modal
var btn = document.getElementById("createExam");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
} 



function createExam()
{
  var a = e1.value;
  var b = e2.value;
  var c = e3.value;
  modal.style.display = "none";
  e1.value = "";
  e2.value = "";
  e3.value = "";
  var form = document.createElement('FORM');
  form.innerHTML += "<button>Click</button>";//add e2 times input field to take questions and e2 * 4 times inline input for options
  document.getElementById('dmModel').appendChild(form);
  dModal.style.display = "block";
  
  
}