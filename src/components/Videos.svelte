<script>
	import PageStore from '../stores/PageStore.js';
    import DataStore from '../stores/DataStore.js';
    import { onDestroy } from 'svelte';
    import { useNavigate } from "svelte-navigator";

    PageStore.set("videos");
    const navigate = useNavigate();
    let allvideos = [];
    const unsubscribe = DataStore.subscribe(value => {
		allvideos = value["videos"];
        allvideos.reverse();
	});
	onDestroy(unsubscribe);
</script>

<div id="videos">
    <div class="container">
        <div id="wrap_videos">
            {#each allvideos as video,index(index)}
            <div class="onevideo" on:click="{() => navigate('/video/' + video['id'])}">
                <div>
                    <img src="{video.photourl}" alt="">
                </div>
                <div class="name">{video.name}</div>
            </div>
            {/each}
        </div>
    </div>
</div>

<style>
	#wrap_videos{
        width:100%;
        column-count: 4;
        column-gap: 15px;
        cursor: pointer;
        padding-top:20px;
        padding-bottom:20px;
    }
    #wrap_videos .onevideo{
        break-inside: avoid-column;
        page-break-inside: avoid;   
        margin-bottom:40px;
        width:100%;
        position:relative;
    }
    @media(max-width:767px){
        #wrap_videos{
            column-count: 3;
        }
    }
    @media(max-width:575px){
        #wrap_videos{
            column-count: 2;
        }
    }
</style>