<script lang="ts">
    import footer from '$lib/images/footer.png';
</script>

<div id="container">
    <div id="text">
        friend of despair
    </div>
    <img src={footer} alt="">
</div>

<style lang="scss">

    @import './../lib/scss/responsive.scss';

    @include mobile{
        #container{
            text-align: center;
            justify-content: center;
        }

        #text{
            position:absolute;
        }
    }

    #container{
        display: flex;
        background-color: #2b2b2b;
        width: 100%;
        height: 200px;
        min-height: 200px;
        color:white;

        font-size: 20px;
        text-align: center;

        justify-content: center;
        align-items: center;
        overflow: hidden;

    }

    #text{
        display: flex;
    }

    img{
        height: 100%;
    }
</style>