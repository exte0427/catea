
<script lang="ts">
	import Loading from './../../lib/sources/Loading.svelte';
  import PostCard from '$lib/sources/PostCard.svelte';
	import {Server} from '../../lib/modules/firebase';
	import { beforeUpdate, onMount } from 'svelte';


    let posts:Server.Post[]=[];
    let visiblePosts:Server.Post[]=[];

	beforeUpdate(() => {
        Server.init();
		Server.getPosts().then((e:Server.Post[])=>{
            posts=e;
        });
	});

    $:visiblePosts=posts.filter((e:Server.Post)=>{
        if(e.title.includes(searchQuery) && (category=='all' || e.category==category)){
            return true;
        }
        return false;
    });

    let searchQuery:string='';
    let category:string='all';
</script>

<div id="searchDiv">
    <input type="text" name="searchQuery" id="searchQuery" autocomplete='off' bind:value={searchQuery}>
    <!--make a select which indicate category-->
    <select name="category" id="category" bind:value={category}>
        <option value="all">all</option>
        <option value="novel">novel</option>
        <option value="essay">essay</option>
        <option value="poem">poem</option>
        <option value="other">other</option>
    </select>
</div>
<div>
    {#if posts.length==0}
        <Loading/>
    {/if}
    {#each visiblePosts as post}
        <PostCard postData={post}/>
    {/each}
</div>

<style lang="scss">

    @import '../../lib/scss/variable.scss';
    @import '../../lib/scss/responsive.scss';

    @include mobile{
        #searchDiv{
            flex-direction: column;
            align-items: center;

            :first-child{
                margin-bottom: 10px;
            }

            #category{
                width: 80%;
                margin-left: 0;
            }
        }
    }


    #searchDiv{
        display: flex;
        justify-content: center;
        margin: -10px;

        background-color: $semi-black-color;
        margin: -10px -10px 0 -10px;
        padding:20px;
    }


    #searchQuery{
        width: 80%;
        height: 30px;

        /*remove border and make it cartoon style*/
        border: 0;
        border-radius: 5px;
        padding: 5px;

        /*cartoon style box shadow*/
        box-shadow: 5px 5px 0px rgba(50, 49, 47, 0.654);

    }

    #category{
        height: 40px;
        margin-left: 10px;

        /*remove border and make it cartoon style*/
        border: 0;
        border-radius: 5px;
        padding: 5px;

        /*cartoon style box shadow*/
        box-shadow: 5px 5px 0px rgba(50, 49, 47, 0.654);
    }

    input:focus {outline: none;}
    select:focus {outline: none;}
    div{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
</style>