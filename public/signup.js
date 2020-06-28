'use strict';
var form = document.forms[0];
form.addEventListener('submit',jsonReciever);

function jsonReciever(event)
{
  
   fetch("/signin",{method:"POST"})
  .then(res => res.json())
  .then(response => {
    console.log(response);
    alert(response.status);
  });
      
  
  
}

