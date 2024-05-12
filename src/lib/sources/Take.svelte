<script lang="ts">
    export let link:string = "/";
</script>

<a href="{link}" target="_blank">
    <slot></slot>
</a>

<style lang="scss">
    a{
        text-decoration: none;
        color: #2b2b2b;
        background-color: #fff;

        display: block;
        padding:10px;
        margin: 5px;
        border-radius: 5px;
        border-width: 2px;
        border-color: #2b2b2b;
        text-align: center;

        font-size: 20px;
    }
</style>