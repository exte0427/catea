<script lang="ts">
	import { Server } from './../modules/firebase';
	import Take from './Take.svelte';
</script>

<div>
    <div id="imgDiv">
        <img src="https://pbs.twimg.com/media/GPED0RrbsAA29Qm?format=jpg&name=4096x4096" alt="">
        <div id="mainText">
            <div id="mainCa">Im Catea</div>
            <div id="subCa">i work to resonate someone</div>
        </div>
    </div>

    <div id="worksContainer">
        <h2>drawings</h2>
        <Take link="https://twitter.com/drawcatea">twitter(X)</Take>
        <Take link="https://twitter.com/drawcatea">pixiv</Take>

        <h2>development</h2>
        <Take link="https://itch.io/dashboard">itch.io</Take>
        <Take link="https://github.com/exte0427">github</Take>

        <h2>writings & video</h2>
        <Take link="https://www.youtube.com/channel/UCdywJSqTF7KGs-CWgen1qHA">youtube</Take>
        <blockquote>writings are not yet!</blockquote>
    </div>
</div>

<style lang="scss">
    @import '../scss/variable.scss';
    #imgDiv{
        width: 100%;
        height: 400px;
        overflow: hidden;
        margin: -10px;
        width: calc(100% + 20px);
        padding: 0;
        position: relative;
    
        #mainText{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            text-align: center;
            color: white;
            font-size: 2em;
            font-weight: bold;
        }
    }

    img{
        
        position: relative;
        border:0;
        border-radius: 0;
        width: 100%;
        margin:0px;
        top:-50%;
        filter: brightness(20%);
    }

    #worksContainer{
        margin-top: 50px;
    }
</style>