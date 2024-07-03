<script lang="ts" >
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { PageModule } from "$lib/modules/pageModule";
  import { scale } from "svelte/transition";

    export let to:string = "/";
    export let name:string = "main";

    let originTriggered = false;
    let triggered=false;

    $:{
        const path=$page.url.pathname.split("/").slice(1).filter(e=>e!=="");
        const toPath=to.split("/").slice(1,-1).filter(e=>e!=="");
        originTriggered=true;
        //console.log(path,toPath);

        if(path.length!=toPath.length)
            originTriggered=false;
        else{
            for(let i=0;i<toPath.length;i++){
                if(path[i]!==toPath[i]){
                    originTriggered=false;
                    break;
                }
            }
        }
    }
    $: triggered = originTriggered;
    const move=()=>{
        goto(to);
    }
</script>

<div id="main">
    <button class="inner" on:click={move} class:inner__selected={triggered}
    on:mouseenter={()=>{triggered=true}} on:mouseleave={()=>{triggered=originTriggered}}>
        {name}
        {#if originTriggered==true}
            <div id="subContainer">
                <slot></slot>
            </div>
        {/if}
    </button>
</div>

<style lang="scss">
    @import '../../lib/scss/variable.scss';

    @mixin triggered{
        color: #fff;
        &:before {
        width: 100%;
        }
    }

    #main{
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    #subContainer{
        display: block;
    }
    

    $inner_border_radius: 5px;
    $trigger: false;

    .inner{
        padding: 10px;
        width: 100%;
        height: 100%;

        border: 0;

        background-color: transparent;
        color : $black-color;
        font-size:20px;
        font-family: "Jua", sans-serif;


        position: relative  ;
        z-index: 1;

        &:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -2;
        }
        &:before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0%;
            height: 100%;
            background-color: $black-color;
            transition: all .3s;
            z-index: -1;
        }

        &__selected{
            $trigger: true;
            @include triggered;
        }
    }
</style>