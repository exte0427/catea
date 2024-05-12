<script lang="ts" >
  import { goto } from "$app/navigation";
  import { PageModule } from "$lib/modules/pageModule";

    export let to:string = "/";
    export let name:string = "main";

    const move=()=>{
        goto(to);
    }
</script>

<div id="main">
    <button id="inner" on:click={move}>
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

    #inner{
        margin: 5px;
        padding: 10px;
        width: 100%;
        height: 100%;

        border-color: #2b2b2b;
        border-width: 2px;
        border-radius: $inner_border_radius;
        border-style: solid;

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
            background-color: #fff;
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
        &:hover {
            $trigger: true;
            @include triggered;
        }
    }
</style>