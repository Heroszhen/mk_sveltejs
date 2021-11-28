<script>
	import PageStore from '../stores/PageStore.js';
    import DataStore from '../stores/DataStore.js';
    import { onDestroy } from 'svelte';
    import { useNavigate } from "svelte-navigator";

	const navigate = useNavigate();

    PageStore.set("home");
    let allactresses = [];
    const unsubscribe = DataStore.subscribe(value => {
		allactresses = value["actresses"];
	});
	onDestroy(unsubscribe);
</script>

<div id="home">
    <div class="container">
        <div class="row">
            <div class="col-12">
                <div id="wrap-actresses">
                {#each allactresses as one}
                    <article class="onephoto" on:click="{() => navigate('/actrice/' + one['id'])}">
                        <img src={one['photourl']} alt="">
                        <div data-bs-toggle="tooltip" class="name" data-bs-placement="bottom" title="{one.name}">
                            {one.name}
                        </div>
                    </article>
                {/each}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
	#wrap-actresses{
        width:100%;
        column-count: 4;
        column-gap: 2px;
        cursor: pointer;
    }
    #wrap-actresses .onephoto{
        break-inside: avoid-column;
        page-break-inside: avoid;   
        margin-bottom:10px;
        width:100%;
        padding:5px;
    }
    #wrap-actresses .onephoto .name{
        text-align: center;
        width:100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background-color: #ededed;
        padding:3px;
    }
    #wrap-actresses .onephoto:hover img{
        color:#fff;
        opacity: 0.85;
    }
    @media(max-width:767px){
        #wrap-actresses{
            column-count: 3;
        }
    }
    @media(max-width:575px){
        #wrap-actresses{
            column-count: 2;
        }
    }
</style>