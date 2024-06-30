<script lang="ts">
	import CateaImg from './CateaImg.svelte';
	import { Server } from './../modules/firebase';
	import Take from './Take.svelte';
    import mainImg from './../images/catea1.png';
</script>

<div>
    <div id="imgDiv">
        <img src={mainImg} alt="">
        <div id="mainText">
            Im Catea<br>
            i work to resonate someone
        </div>
    </div>

    <div id="imgForMobile">
        <img src={mainImg} alt="">
        <div id="mainText">
            Im Catea<br>
            i work to resonate someone
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
        <Take link="/posts" newTab={false}>posts</Take>
    </div>
</div>

<style lang="scss">
    @import '../scss/variable.scss';
    @import '../scss/responsive.scss';

    #imgDiv{
        width: 100%;
        height: 400px;
        overflow: hidden;
        margin: -10px;
        width: calc(100% + 20px);
        padding: 0;
        position: relative;

        display: flex;
        justify-content: right;
    
        #mainText{
            position: absolute;
            top: 50%;
            left:0;
            text-align: left;
            color: white;
            font-size: 2em;
            font-weight: bold;

            margin-left:40px;

            color:$semi-black-color;
        }

        img{
            height: 400px;
            width: auto;
            margin:0;
            padding: 0;
            border-radius: 0;
        }
    }

    #worksContainer{
        margin-top: 50px;
    }

    @include mobile{
        #imgDiv{
            display: none;
        }

        #mainText{
            text-align: center;
            font-size: 1.5em;
            font-weight: bold;

            color:$semi-black-color;
        }
    }

    @include desktop{
        #imgForMobile{
            display: none;
        }
    }
</style>