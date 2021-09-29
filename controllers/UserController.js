class UserController { 

    constructor(formIdCreate, formIdUpdate, tableId){
        
        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
        this.onEdit();
    } // end of constructor

    onSubmit(){

        this.formEl.addEventListener("submit", event => {
            
           let btn = this.formEl.querySelector("[type=submit]");

           btn.disabled = true;

            event.preventDefault();

            let values = this.getValues(this.formEl);
            
            if(!values) return false;
            
            if(values._name && values._birth && values._country && values._email && values._password && values._gender){

                this.getPhoto().then(
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

        document.querySelector("#box-user-edit .btn-edit-cancel").addEventListener("click", e=>{
            console.log("deu certo");
            this.showPanelCreate();
        });

        this.formUpdateEl.addEventListener("submit", e=>{

            e.preventDefault();

            let btn = this.formUpdateEl.querySelector("[type=submit]");

           btn.disabled = true;

           let values = this.getValues(this.formUpdateEl);

           console.log(values);

           let index = this.formUpdateEl.dataset.trIndex;

           let tr = this.tableEl.rows[index];

           tr.dataset.user = JSON.stringify(values);

           tr.innerHTML = `
    
           <tr>
           <td><img src="${values.photo}" alt="User Image" class="img-circle img-sm"></td>
           <td>${values.name}</td>
           <td>${values.email}</td>
           <td>${values.admin}</td>
           <td>${values.register}</td>
           <td>
               <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
               <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
           </td>
           </tr>
       
       `;
   
           this.tableEl.appendChild(tr);

           this.addEventsTR(tr);

           this.updateCount();
        
   


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


    getPhoto(){

        return new Promise((resolve, reject) => {
            
            let fileReader = new FileReader();
        
            let elements = [...this.formEl.elements].filter(item =>{
    
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
                    console.log("esta pegando isto " + user.gender)
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

    
  addEventsTR(tr){

    tr.querySelector(".btn-edit").addEventListener("click", e=>{
            
            
        let json = JSON.parse(tr.dataset.user);
        console.log(json);
        let form = document.querySelector("#form-user-update");

        form.dataset.trIndex = tr.sectionRowIndex;
        for (let name in json){

                let field = form.querySelector("[name=" + name.replace("_", "") + "]");

                if(field){


                    switch (field.type) {
                        case 'file':
                            continue;
                            break;
                        
                        case 'radio':
                            field = form.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
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

        this.showPanelEdit();
    });


  }
    
    
    addLine(dataUser){

        
        let tr = document.createElement('tr');

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
            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
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


