<script lang="ts">
    import cateaImg_static from './../images/cateaMoving.png';
    import catea_Img_dynamic from './../images/cateaMoving.gif';

    let cateaImg = cateaImg_static;

    const change=()=>{
        // 50% chance
        if(Math.random() > 0.5)
            cateaImg = catea_Img_dynamic;
        else
            cateaImg = cateaImg_static;

        setTimeout(change, 1000);
    }

    change();
</script>

<div id="img">
    <img src={cateaImg} alt="" id="cateaImg">
</div>

<style>

    #img{
        position: absolute;
        bottom:0;
        
        display: flex;
        align-items: center;
        justify-items: center;
        text-align: center  ;
        justify-content: center;
    }

    #cateaImg{
		width: 80%;
		mix-blend-mode: multiply;
		border-radius: 0;
		border:0;

        padding: 0;
        margin:0;
	}
</style>