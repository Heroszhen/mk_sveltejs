<script>
    import { createEventDispatcher } from 'svelte';
    import { Magnifier } from 'svelte-magnifier';

    export let photourl;
    const dispatch = createEventDispatcher();
    function closeModalphoto(){
        dispatch('message',{});
    }
</script>

<div id="modalphoto" on:click="{()=>closeModalphoto()}">
    <!-- <img src="{photourl}" alt=""> -->
    <Magnifier src="{photourl}" alt="" />
</div>

<style>
    #modalphoto{
        position:absolute;
        z-index:8888;
        position:fixed;
        width:100%;
        height:100vh;
        background-color: rgba(0,0,0,.5);
        top:0;
        left:0;
        display:flex;
        justify-content: center;
        align-items: center;
        padding:5px 20px;
    }
    :global(.magnifier){
        width:auto !important;
        height: 100% !important;;
    }
    :global(.magnifying-glass) {
        width:200px !important;
		height:200px !important;
	}

    @media (max-width:767px) {
        :global(.magnifier){
            width:100% !important;
            height: auto !important;;
        }
    }
</style>