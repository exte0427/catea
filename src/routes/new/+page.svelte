<script lang="ts">
	import { editedPost } from './../../lib/modules/editPost';
	import { PageModule } from '$lib/modules/pageModule';
  import { goto } from "$app/navigation";
  import { Server } from "$lib/modules/firebase";



    let title = '';
    let content = '';
    let category = '';
    let uploadName = '';
    let editId = ``;

    if($editedPost!==''){
        Server.getPost($editedPost).then(e=>{
            title = e.title;
            content = e.desc;
            category=e.category;
            editId = $editedPost;

            editedPost.set(``);
        });
    }

    Server.init();

    const handleSubmit=(event:Event)=>{
        event.preventDefault();

        if(editId === ``){
            Server.addPost(title,content,category).then(e=>{
                goto('/');
            });
        }
        else{
            Server.editPost(title,content,category,editId).then(e=>{
                goto('/');
            });
        }
    }

    const handleFileChange=(event:any)=>{
        
        Server.addFile(event.target.files[0]).then(e=>{
            uploadName = e;
        });
    
    }
</script>

<h1>Post Form</h1>
<form on:submit={handleSubmit}>
    <label for="title">Title:</label><br>
    <input type="text" id="title" bind:value={title}><br>

    <label for="category">Category:</label><br>
    <input type="text" id="category" bind:value={category}><br>

    <label for="content">Content:</label><br>
    <textarea id="content" bind:value={content}></textarea><br><br>

    <button type="submit">Submit</button>
</form>

<h1>Image Form</h1>
<input type="file" accept="image/*" on:change={handleFileChange}>
<pre>{uploadName}</pre>

<h1>preview</h1>
{@html PageModule.view(content)}

<style lang="scss">
    #content{
        width: 100%;
        height: 300px;

        margin: 10px;
        border-radius: 5px;
        border-width: 0px;
        
    }
</style>