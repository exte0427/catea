<script lang="ts">
	import { editedPost } from './../../lib/modules/editPost';
	import { PageModule } from '$lib/modules/pageModule';
    import { goto } from "$app/navigation";
    import { Server } from "$lib/modules/firebase";
    import { Carta, MarkdownEditor } from 'carta-md';
	import 'carta-md/default.css'; /* Default theme */

	const carta = new Carta({
		// Remember to use a sanitizer to prevent XSS attacks!
		// More on that below
		sanitizer: false
	});


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
<label for="title">Title:</label><br>
<input type="text" id="title" bind:value={title}><br>

<label for="category">Category:</label><br>
<input type="text" id="category" bind:value={category}><br>

<label for="content">Content:</label><br>
<MarkdownEditor {carta} bind:value={content} />

<button on:click={handleSubmit}>Submit</button>

<h1>Image Form</h1>
<input type="file" accept="image/*" on:change={handleFileChange}>
<pre>{uploadName}</pre>

<style lang="scss">
    @import '../../lib/scss/variable.scss';

    /* Set your monospace font (Required to have the editor working correctly!) */
	:global(.carta-font-code) {
		font-family: '...', monospace;
		font-size: 1.1rem;
	}
</style>