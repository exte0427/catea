<script lang="ts">
    export let link:string = "/";
    export let newTab:boolean = true;

    let targetData = "_self";
    if(newTab)
        targetData = "_blank";
</script>

<a href="{link}" target={targetData}>
    <slot></slot>
</a>

<style lang="scss">
    @import '../../lib/scss/variable.scss';
    a{
        text-decoration: none;
        color: white;
        background-color: $semi-black-color;

        display: block;
        padding:10px;
        margin: 5px;
        margin-bottom: 10px;
        border-radius: 5px;
        border-width: 2px;
        border-color: #2b2b2b;
        text-align: center;

        font-size: 20px;
        font-weight: bold;
        box-shadow: 5px 5px 0 rgba(50, 49, 47, 0.654);

        /*hover effect*/
        transition: 0.3s;

    }

    a:hover{
        box-shadow: 0px 0px 0 rgba(50, 49, 47, 0.654);
        transform: translate(5px,5px);
    }
</style>