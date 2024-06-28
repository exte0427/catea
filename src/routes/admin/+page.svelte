<script lang="ts">
	import { Server } from '$lib/modules/firebase';
  import { isAdmin } from '$lib/modules/isAdmin';
  
    let id:string="";
    let password:string="";

    Server.init();
    const auth=()=>{
        Server.auth(id,password).then(e=>{
            if(e){
                //acts.add({message:`successfully logined as admin`, mode:'success', lifetime:5 });
                isAdmin.set(true);
            }
            else
            ;
                //acts.add({message:`failed to login as admin`, mode:'danger', lifetime:5 });
        });
    }
</script>

<form on:submit={auth}>
    <label for="id">email</label>
    <input type="email" name="email" id="id" bind:value={id}>

    <label for="password">password</label>
    <input type="password" name="password" id="password" bind:value={password}>
    <input type="submit">
</form>

<style lang="scss">
    @import '../../lib/scss/variable.scss';

    form{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 100px;

        label{
            color: white;
            font-size: 1.5em;
        }

        input{
            width: 200px;
            height: 30px;
            margin: 10px;
            border-radius: 5px;
            border-width: 0px;
        }

        input[type="submit"]{
            background-color: $semi-black-color;
            color: white;
            cursor: pointer;
            border-radius: 5px;
            border-width: 0px;
        }
    }
</style>