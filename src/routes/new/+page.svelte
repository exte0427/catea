<script lang="ts">
	import { PageModule } from '$lib/modules/pageModule';
  import { goto } from "$app/navigation";
  import { Server } from "$lib/modules/firebase";



    let title = '';
    let content = '';
    let uploadName = '';

    Server.init();

    const handleSubmit=(event:Event)=>{
        event.preventDefault();
        Server.addPost(title,content).then(e=>{
            goto('/');
        });
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
    <label for="content">Content:</label><br>
    <textarea id="content" bind:value={content}></textarea><br><br>
    <button type="submit">Submit</button>
</form>

<h1>Image Form</h1>
<input type="file" accept="image/*" on:change={handleFileChange}>
<pre>{uploadName}</pre>

<h1>preview</h1>
{@html PageModule.view(content)}