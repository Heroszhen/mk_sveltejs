<script>
	import PageStore from '../stores/PageStore.js';
    import DataStore from '../stores/DataStore.js';
    import { onDestroy } from 'svelte';

    PageStore.set("photos");
    let allphotos = [];
    const unsubscribe = DataStore.subscribe(value => {
		allphotos = value["photos"];console.log(allphotos)
	});
	onDestroy(unsubscribe);
</script>

<div id="photos">
    <div class="container">
        <div id="wrap_photos">
        {#each allphotos as photo,index(index)}
            <div class="onephoto">
                <div>
                    <img src="{photo.photourl}" alt="">
                </div>
                <div class="name">{photo.name}</div>
            </div>
        {/each}
        </div>
        
    </div>
</div>

<style>
    /* https://www.pinterest.fr/search/pins/?rs=ac&len=2&q=food&eq=food&etslf=3228&term_meta[]=food%7Cautocomplete%7C0 */
	#wrap_photos{
        width:100%;
        column-count: 4;
        column-gap: 15px;
        cursor: pointer;
        padding-top:10px;
        padding-bottom:10px;
    }
    #wrap_photos .onephoto{
        break-inside: avoid-column;
        page-break-inside: avoid;   
        margin-bottom:10px;
        width:100%;
        position:relative;
    }
    #wrap_photos .onephoto img{
        border-radius: 16px;
    }
    #wrap_photos .onephoto .name{
        position: absolute;
        top:0;
        height:100%;
        width:100%;
        display:none;
    }
    #wrap_photos .onephoto:hover .name{
        display:block;
        background-color:rgba(255,255,255,.5);
        padding:5px;
    }
    @media(max-width:767px){
        #wrap_photos{
            column-count: 3;
        }
    }
    @media(max-width:575px){
        #wrap_photos{
            column-count: 2;
        }
    }
</style>