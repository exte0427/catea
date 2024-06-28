<script lang="ts">
    export let link:string = "/";
</script>

<a href="{link}" target="_blank">
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

    }
</style>