<script>
	import PageStore from '../stores/PageStore.js';
    import DataStore from '../stores/DataStore.js';
    import { onDestroy } from 'svelte';
    import { getRandomNumber } from '../services/ToolService.js'
    import Paginator from 'svelte-paginator';

    import ModalPhoto from './ModalPhoto.svelte';

    PageStore.set("photos");
    let photourl = "";
    let allphotos = [];
    let timer = null;
    let order = 0;
    const unsubscribe = DataStore.subscribe(value => {
		allphotos = value["photos"];
	});
	onDestroy(()=>{
        unsubscribe;
        Diaporama(0);
    });

    const loadPhotos=(page=1, perPage=10)=>{
        if(allphotos.length > 0){
            const start = perPage * (page-1)
            const end = start + perPage
            return {
                items: allphotos.slice(start, end),
                numItems: allphotos.length
            }
        }else{
            return {
                items: [],
                numItems: 0
            }
        }
       
    }


    function setPhotourl(url){
        photourl = url;
    }
    function closeModalphoto(){
        Diaporama(0);
    }
    //1:start,0:end
    function Diaporama(action){
        if(action == 0){
            window.clearInterval(timer);
            timer = null;
            photourl = "";
        }else{
            let index = 0;
            setPhotourl(allphotos[index]["photourl"]);
            timer = window.setInterval(()=>{
                index++;
                setPhotourl(allphotos[index]["photourl"]);
                if(index >= allphotos.length)index = 0;
            },1500);
        }
    }

    function orderPhotos(action){
        let allphotos2 = allphotos;
        allphotos = [];
        loadPhotos();
        order = action;
        if(action == 1){
            let tab_index = [];
            let tab = [];//stock new photos
            let index;
            while(tab_index.length != allphotos2.length){
                index = getRandomNumber(0,allphotos2.length - 1);
                while(tab_index.includes(index))index = getRandomNumber(0,allphotos2.length - 1);
                tab_index.push(index);
            }
            tab_index.forEach(index=>tab.push(allphotos2[index]));
            allphotos2 = tab;
        }else{
            allphotos2.sort((a,b)=>{
                if(action == 2)return a.name.localeCompare(b.name);
                else return b.name.localeCompare(a.name);
            });
        }
        setTimeout(() => {
            allphotos = allphotos2;
            loadPhotos();
        }, 10);
        
        
    }
</script>

<div id="photos">
    <div class="container pt-2 pb-2" id="container_wrap">
        <div id="btns_wrap" class="d-flex align-items-center">
            <div>
                <button class="btn btn-sm btn-dark" on:click="{()=>Diaporama(1)}">Diaporama</button>
            </div>
            <div>
                <div class="dropdown">
                    <button class="btn btn-primary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        {#if order == 0}
                            Ordonnées par
                        {:else if order == 1}
                            Arbitraire
                        {:else if order == 2}
                            Nom - croissant
                        {:else}
                            Nom - décroissant
                        {/if}
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li>
                          <div class="dropdown-item pointer"  on:click="{(e)=>orderPhotos(1)}">Arbitraire</div>
                        </li>
                        <li>
                            <div class="dropdown-item pointer"  on:click="{(e)=>orderPhotos(2)}">Nom - croissant</div>
                        </li>
                        <li>
                            <div class="dropdown-item pointer"  on:click="{(e)=>orderPhotos(3)}">Nom - décroissant</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- <div id="wrap_photos">
        {#each allphotos as photo,index(index)}
            <div class="onephoto" on:click="{()=>setPhotourl(photo.photourl)}">
                <div>
                    <img src="{photo.photourl}" alt="">
                </div>
                <div class="name">{photo.name}</div>
            </div>
        {/each}
        </div> -->
        {#if allphotos.length > 0}
        <Paginator loadItems={loadPhotos} perPage={20} let:items>
            <div id="wrap_photos">
                {#each items as photo,index(index)}
                    <div class="onephoto" on:click="{()=>setPhotourl(photo.photourl)}">
                        <div>
                            <img src="{photo.photourl}" alt="">
                        </div>
                        <div class="name">{photo.name}</div>
                    </div>
                {/each}
            </div>
          </Paginator>
          {/if}
    </div>
    {#if photourl != ""}
        <ModalPhoto photourl={photourl} on:message={closeModalphoto}  />
    {/if}
</div>

<style>
    #photos #container_wrap>:global(div.paginator-button-group:nth-child(2)){
        display:none;
    }
    #photos #container_wrap>:global(div.paginator-button-group){
        text-align: center;
        margin-top:10px;
    }
    #photos #container_wrap :global(div.paginator-button-group button.paginator-button){
        color:pink !important;
        background-color: white !important;
        border-color:pink !important;
    }
    #photos #container_wrap :global(div.paginator-button-group button.paginator-current-page){
        color:white !important;
        background-color: pink !important;
    }
    /* https://www.pinterest.fr/search/pins/?rs=ac&len=2&q=food&eq=food&etslf=3228&term_meta[]=food%7Cautocomplete%7C0 */
	#wrap_photos{
        width:100%;
        column-count: 5;
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

    #photos #btns_wrap>div{
        margin-right:20px
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