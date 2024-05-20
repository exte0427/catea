<script lang="ts" >
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { PageModule } from "$lib/modules/pageModule";

    export let to:string = "/";
    export let name:string = "main";

    let originTriggered = false;
    let triggered=false;

    $: originTriggered=$page.url.pathname.split("/")[1] === to.split("/")[1];
    $: triggered = originTriggered;
    const move=()=>{
        goto(to);
    }
</script>

<div id="main">
    <button class="inner" on:click={move} class:inner__selected={triggered}
    on:mouseenter={()=>{triggered=true}} on:mouseleave={()=>{triggered=originTriggered}}>
        {name}
    </button>
</div>

<style lang="scss">
    @import url('https://fonts.googleapis.com/css2?family=Poetsen+One&display=swap');

    @mixin triggered{
        color: #fff;
        &:before {
        width: 100%;
        }
    }

    #main{
        display: flex;
        width: 100%;
    }

    $inner_border_radius: 5px;
    $trigger: false;

    .inner{
        padding: 10px;
        width: 100%;
        height: 100%;

        border: 0;

        background-color: transparent;
        color : #2b2b2b;
        font-size:20px;

        font-family: "Poetsen One", sans-serif;
        font-weight: 400;
        font-style: normal;
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
            background-color: #2b2b2b;
            transition: all .3s;
            z-index: -1;
        }

        &__selected{
            $trigger: true;
        @include triggered;
        }
    }
</style>