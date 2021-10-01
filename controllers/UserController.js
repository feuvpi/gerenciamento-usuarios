class UserController { 

    constructor(formIdCreate, formIdUpdate, tableId){
        
        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
        this.selectAll();
    } // end of constructor

    onSubmit(){

        this.formEl.addEventListener("submit", event => {
            
           let btn = this.formEl.querySelector("[type=submit]");

           btn.disabled = true;

            event.preventDefault();

            let values = this.getValues(this.formEl);
            
            if(!values) return false;
            
            if(values._name && values._birth && values._country && values._email && values._password && values._gender){

                this.getPhoto(this.formEl).then(
                    (content) => {
                    values.photo = content;
                    this.addLine(values);
                },

                function(e){
                    console.log(e);
                }
            )

            this.formEl.reset()
           btn.disabled = false;

            }  else {
                
                
                console.log(values);
                btn.disabled = false;
                alert("Necessita preencher campos!");
            }

            
        });


    } //end of onSubmit method

    
    onEdit(){

        document.querySelector("#box-user-edit .btn-edit-cancel").addEventListener("click", e=>{ //adiciona funcionalidade ao botao de cancelar do formulario de edição
            console.log("deu certo");
            this.showPanelCreate();
        });

        this.formUpdateEl.addEventListener("submit", e=>{ //funcionalidade do botao submit do formulario de edicao

            e.preventDefault();

           let btn = this.formUpdateEl.querySelector("[type=submit]");

           btn.disabled = true;

           let values = this.getValues(this.formUpdateEl);

           console.log(values);

           let index = this.formUpdateEl.dataset.trIndex; //metodo onEdit() chama o metodo addEventsTR(tr), que contem a linha: this.formUpdateEl.dataset.trIndex = this.tableEl.rows[index].sectionRowIndex;

           console.log(index);

           let tr = this.tableEl.rows[index];

           let userOld = JSON.parse(tr.dataset.user);

           let result = Object.assign({}, userOld, values);

           if(!values.photo) result._photo = userOld._photo;

           tr.dataset.user = JSON.stringify(result);

           //return this._register.toLocaleDateString("en-US");

          
           
           this.showPanelCreate();

           this.getPhoto(this.formUpdateEl).then(
               (content) => {

                    if(!values.photo){
                        result._photo = userOld._photo;
                    } else {
                        result._photo = content;
                    }
                    tr.innerHTML = `
    
                        <tr>
                            <td><img src="${result._photo}" alt="User Image" class="img-circle img-sm"></td>
                            <td>${result._name}</td>
                            <td>${result._email}</td>
                            <td>${result._admin}</td>
                            <td>${result._register.toLocaleDateString("en-US")}</td>
                            <td>
                                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
                            </td>
                        </tr>
       
                        `;
   
                    this.tableEl.appendChild(tr);

                    this.addEventsTR(tr);
                    this.updateCount();

                    this.formUpdateEl.reset;
                    btn.disabled = false;

                },

            function(e){
                    console.log(e);
            }
        )

    

           

        });
       
        

    } // End of onEditCancel method

    showPanelCreate(){

        document.querySelector("#box-user-create").style.display = "";
        document.querySelector("#box-user-edit").style.display = "none";

    } // End of showPanelCreate method


    showPanelEdit(){

        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-edit").style.display = "";

    } // End of showPanelEdit method


    getPhoto(formEl){

        return new Promise((resolve, reject) => {
            
            let fileReader = new FileReader();
        
            let elements = [...formEl.elements].filter(item =>{
    
                if(item.name === 'photo'){
                    return item;
                }
            });
    
            let file = elements[0].files[0];
            
            if(file){
                fileReader.readAsDataURL(file);
            } else {
                resolve('dist/img/boxed-bg.jpg');
            }
    
            fileReader.onload = ()=>{
                resolve(fileReader.result);
            }

            fileReader.onerror = (e) => {
                reject(e);
            }
    


        });
        
       
       

    } // end of getPhoto method

    getValues(formEl){ 

        let user = {};
        let isValid = true;

            [...formEl.elements].forEach((fields, index) => {
   
                
            if(['name', 'email', 'password'].indexOf(fields.name) > -1 && !fields.value) {

                    fields.parentElement.classList.add('has-error');
                    isValid = false;
                    //return false;
            }
            
            if(fields.name == "gender"){
                if(fields.checked){
                    user[fields.name] = fields.value;
                }
            } else if(fields.name == "admin"){

                if(fields.checked){
                    user[fields.name] = "Sim";
                    //user[fields.value] = "True";
                } else {
                    user[fields.name] = "Não";
                    //user[fields.value] = "False";
                }
            
            } else {
                user[fields.name] = fields.value;
            }
        });

        if(!isValid){
            return false;
        }

        return new User(
            user.name,
            user.gender,
            //user.data,
            user.birth,
            user.country, 
            user.email, 
            user.password, 
            user.photo, 
            user.admin
        )

    } // end of getValues method

    
  addEventsTR(tr){ //metodo para pegar os valores da linha da tabela a ser editada e alimentar os campos do formulario de edição

    tr.querySelector(".btn-delete").addEventListener("click", e=>{ //funcionalidade do botao delete

        if(confirm("Tem certeza que deseja excluir?")){

            tr.remove;
            this.updateCount();

        }

    })
    
    
    tr.querySelector(".btn-edit").addEventListener("click", e=>{ //funcionalidade botao de editar; this.tableEl.rows[index]; o querySelector esta pegando a linha da tabela aonde o botao "edit" foi clicado
            
        console.log("antes do JSON.parse: ", tr); 
        console.log("utilizando dataset.user: ", tr.dataset.user);
        let json = JSON.parse(tr.dataset.user); //transformando o conteudo da linha da tabela em JSON
    
        console.log("apos o JSON.parse: ", json);

        console.log("mesma coisa outra forma: ", JSON.parse(tr.dataset.user));
        //let form = document.querySelector("#form-user-update");

        this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex; //this.tableEl.rows[index].sectionRowIndex armazenando em variavel a index da linha em que o botao de editar foi clicado
        console.log("index da linha que se pretende editar: ", tr.sectionRowIndex);

        for (let name in json){ //loop para varrer todos os atributos na variavel json 

                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "]"); //utilizando os atributos da variavel json para encontrar os campos correspondentes no formulario

                if(field){ //verificando se o campo atual existe

                    //preenchendo os campos do formulario de edicao com os valores da linha da tabela encontrados 
                    switch (field.type) {
                        case 'file':
                            continue;
                            break;
                        
                        case 'radio':
                            field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
                            field.checked = true;
                            break;

                        case 'checkbox':
                            if(json[name] == "Sim"){
                                field.checked = true;
                            } else {
                                field.checked = false;
                            }
                            
                            break;

                        default:
                            field.value = json[name];
                    } 
                    
                }

        }

        this.formUpdateEl.querySelector(".photo").src = json._photo;
        

        this.showPanelEdit();
    });


  }
    
  
  getUsersStorage(){

    let users = [];
    
    if(sessionStorage.getItem("users")){

        users = JSON.parse(sessionStorage.getItem("users"));

    }

    return users;

  }
  
  
  selectAll(){

    let users = this.getUsersStorage();

    users.forEach(dataUser=>{

        let user = new User();

        user.loadFromJSON(dataUser);
        
        this.addLine(user);

   })

  }
  
  
  insert(data){ //metodo para inserir os dados da tabela atual na sessionStorage

    let users = this.getUsersStorage();
    
    
    users.push(data);
    
    sessionStorage.setItem("users", JSON.stringify(users));

  } //end of insert method
    
    addLine(dataUser){

        
        let tr = document.createElement('tr');

        this.insert(dataUser);

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `
    
        <tr>
        <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
        <td>${dataUser.name}</td>
        <td>${dataUser.email}</td>
        <td>${dataUser.admin}</td>
        <td>${dataUser.register}</td>
        <td>
            <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
        </td>
        </tr>
    
    `;

        this.tableEl.appendChild(tr);

      this.addEventsTR(tr);
        

        this.updateCount();


    } //end of addLine method

    updateCount(){

        let numberUsers = 0;
        let numberAdmins = 0;
        
        [...this.tableEl.children].forEach(tr=>{

            let user = JSON.parse(tr.dataset.user);
            
            numberUsers++;
            if(user._admin) numberAdmins++;
             
        });

        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-admins").innerHTML = numberAdmins;
        
    }

}


