class User {

    constructor(name, gender, birth, country, email, password, photo, admin){

        this._id;
        this._name = name;
        this._gender = gender;
        //this._data = data;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();

    }

    get id(){

        return this._id;

    }

    get register(){
        return this._register.toLocaleDateString("en-US");
    }


    get name(){

        return this._name;

    }

    set name(value){

        this._name = value;
    }

    get gender(){

        return this._gender;

    }

    set gender(value){

        this._gender = value;
    }


    get birth(){

        return this._birth;

    }

    set birth(value){

        this._birth = value;
    }


    get country(){

        return this._country;

    }

    set country(value){

        this._country = value;
    }


    get email(){

        return this._email;

    }

    set email(value){

        this._email = value;
    }


    get photo(){

        return this._photo;

    }

    set photo(value){

            this._photo = value;

    }

    get admin(){
        return this._admin;
    }

    set admin(value){
        this._admin = value;
    }

    loadFromJSON(json){

        for(let name in json){

            if(name == "_register"){
                
                this[name] = new Date(json[name]);

            } else {

                this[name] = json[name];
            }
            
            
        }

    }

    static getUsersStorage(){

        let users = [];
        
        if(localStorage.getItem("users")){ 
    
            users = JSON.parse(localStorage.getItem("users"));
    
        }
    
        return users;
    
      } // end of getUserStorage method

    
    getNewID(){

        let users = User.getUsersStorage();
        let last_id = 0;
        let newID = 0;

        users.map(u=>{ 

            if(u._id > last_id){
                last_id = u._id;
                }

            
            
        });
        newID = last_id + 1;
        return newID;


    } //end of getNewID() method

  
    remove(){

        let users = User.getUsersStorage();

        users.forEach((u, index) => {

            if(u._id == this._id){
                users.splice(index, 1);
            }
        });

        localStorage.setItem("users", JSON.stringify(users));
        
    }
    
      save(){

        let users = User.getUsersStorage(); //retorna todos os usuarios que estao no localStorage e armazena os objetos em um array []
    
        if(this.id > 0){ //verificar se o objeto sendo salvo ja possui um id

             users.map(u=>{

               if(u._id == this._id){
        
                Object.assign(u, this);
            
            } 
                 


             })
            
            
           

        } else {

            this._id = this.getNewID();

            users.push(this);
        
            //sessionStorage.setItem("users", JSON.stringify(users));
            
        }

        localStorage.setItem("users", JSON.stringify(users));

    } //end of save() method


}
