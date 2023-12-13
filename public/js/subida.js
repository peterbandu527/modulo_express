fetch("/getmedios")
  .then((response) => response.json())
  .then((data) => {
    var medios = data.mediacontent;
    var contenido_data = document.getElementById('columns_data');
    
    medios.forEach((file) => {
      var base64Image = `data:${file.mimetype};base64,${file.contenido}`;
      console.log(base64Image);
      var name = file.name;      

      var div_col = document.createElement('div');
      div_col.setAttribute('class', 'col-lg-3 col-md-4 col-6');

      var div_card = document.createElement('div');
      div_card.setAttribute('class', 'card');

      var div_cardbody = document.createElement('div');
      div_cardbody.setAttribute('class', 'card-body');

      var img = document.createElement('img');
      img.setAttribute('class', 'img img-thumbnail');
      img.src = base64Image;

      var url = `/medios/${name}`;
      var ahref = document.createElement("a");
      ahref.href = url;
      var data_name = document.createElement('p');
      data_name.textContent = name;

      ahref.appendChild(data_name);
      div_cardbody.appendChild(img);
      div_cardbody.appendChild(ahref);
      div_card.appendChild(div_cardbody);
      div_col.appendChild(div_card);
      
      contenido_data.appendChild(div_col);
    });
  });
