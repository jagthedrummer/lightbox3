// -----------------------------------------------------------------------------------
//
//	Lightbox v3.0
//	by Jeremy Green
//	Last Modification: 3/15/11
//
// -----------------------------------------------------------------------------------
//
//  Based on:
//	Lightbox v2.04
//	by Lokesh Dhakar - http://www.lokeshdhakar.com
//	Last Modification: 2/9/08
//
//	For more information, visit:
//	http://lokeshdhakar.com/projects/lightbox2/
//
//	Licensed under the Creative Commons Attribution 2.5 License - http://creativecommons.org/licenses/by/2.5/
//  	- Free for use in both personal and commercial projects
//		- Attribution requires leaving author name, author link, and the license info intact.
//	
//  Thanks: Scott Upton(uptonic.com), Peter-Paul Koch(quirksmode.com), and Thomas Fuchs(mir.aculo.us) for ideas, libs, and snippets.
//  		Artemy Tregubenko (arty.name) for cleanup and help in updating to latest ver of proto-aculous.
//
// -----------------------------------------------------------------------------------
// 
//  Some code and concepts borrowed from lightwindow from stickmanlabs
//  
//  http://www.p51labs.com/lightwindow/
//  
// -----------------------------------------------------------------------------------
//
//  Video sharing code from Flower.
//  
//  https://github.com/cashmusic/Flower
/*

    Table of Contents
    -----------------
    Configuration

    Lightbox Class Declaration
    - initialize()
    - updateImageList()
    - start()
    - changeImage()
    - resizeContentContainer()
    - showImage()
    - updateDetails()
    - updateNav()
    - enableKeyboardNav()
    - disableKeyboardNav()
    - keyboardAction()
    - preloadNeighborImages()
    - end()
    
    Function Calls
    - document.observe()
   
*/
// -----------------------------------------------------------------------------------

//
//  Configurationl
//
LightboxOptions = Object.extend({
    fileLoadingImage:        'images/loading.gif',     
    fileBottomNavCloseImage: 'images/closelabel.gif',

    overlayOpacity: 0.8,   // controls transparency of shadow overlay

    animate: true,         // toggles resizing animations
    resizeSpeed: 9,        // controls the speed of the image resizing animations (1=slowest and 10=fastest)

    borderSize: 10,         //if you adjust the padding in the CSS, you will need to update this variable

	// When grouping images this is used to write: Image # of #.
	// Change it for non-english localization
	labelImage: "Image",
	labelOf: "of",
	defaultWidth : 250,  //the width used when we don't know what size the lightbox should be
	defaultHeight : 250,  //the height used when we don't know what size the lightbox should be
	fileTypes : {
		page : ['asp', 'aspx', 'cgi', 'cfm', 'htm', 'html', 'pl', 'php4', 'php3', 'php', 'php5', 'phtml', 'rhtml', 'shtml', 'txt', 'vbs', 'rb'],
		video : ['aif', 'aiff', 'asf', 'avi', 'divx', 'm1v', 'm2a', 'm2v', 'm3u', 'mid', 'midi', 'mov', 'moov', 'movie', 'mp2', 'mp3', 'mp4', 'mpa', 'mpa', 'mpe', 'mpeg', 'mpg', 'mpg', 'mpga', 'pps', 'qt', 'rm', 'ram', 'swf', 'viv', 'vivo', 'wav'],
		image : ['bmp', 'gif', 'jpeg', 'jpg', 'png', 'tiff','tif']
	},
	codecs : {
		mp4 : 'avc1.42E01E, mp4a.40.2',
		webm : 'vp8, vorbis',
		ogv : 'theora, vorbis' 
	},
	mimeTypes : {
		avi : 'video/avi',
		aif : 'audio/aiff',
		aiff : 'audio/aiff',
		gif : 'image/gif',
		bmp : 'image/bmp',
		jpeg : 'image/jpeg',
		jpg : 'image/jpeg',
		m1v : 'video/mpeg',
		m2a : 'audio/mpeg',
		m2v : 'video/mpeg',
		m3u : 'audio/x-mpequrl',
		mid : 'audio/x-midi',
		midi : 'audio/x-midi',
		mjpg : 'video/x-motion-jpeg',
		moov : 'video/quicktime',
		mov : 'video/quicktime',
		movie : 'video/x-sgi-movie',
		mp2 : 'audio/mpeg',
		mp3 : 'audio/mpeg3',
		mp4 : 'video/mp4',
		mpa : 'audio/mpeg',
		mpa : 'video/mpeg',
		mpe : 'video/mpeg',
		mpeg : 'video/mpeg',
		mpg : 'audio/mpeg',
		mpg : 'video/mpeg',
		mpga : 'audio/mpeg',
		ogv : 'video/ogg',
		pdf : 'application/pdf',
		png : 'image/png',
		pps : 'application/mspowerpoint',
		qt : 'video/quicktime',
		ram : 'audio/x-pn-realaudio-plugin',
		rm : 'application/vnd.rn-realmedia',
		swf	: 'application/x-shockwave-flash',
		tiff : 'image/tiff',
		tif : 'image/tiff',
		viv : 'video/vivo',
		vivo : 'video/vivo',
		wav : 'audio/wav',
		webm : 'video/webm',
		wmv : 'application/x-mplayer2'			
	},
	
	videoEmbed : "<div class=\"video-js-box\">"+
					"<video id=\"lbVideo\" class=\"video-js\" width=\"#{width}\" height=\"#{height}\" controls preload autoplay>"+
						//"<source src=\"http://video-js.zencoder.com/oceans-clip.mp4\" type='video/mp4; codecs=\"avc1.42E01E, mp4a.40.2\"' />"+
						//"<source src=\"http://video-js.zencoder.com/oceans-clip.webm\" type='video/webm; codecs=\"vp8, vorbis\"' />" +
						//"<source src=\"http://video-js.zencoder.com/oceans-clip.ogv\" type='video/ogg; codecs=\"theora, vorbis\"' />" +
						"#{sources}" +
						"<object id=\"flash_fallback_1\" class=\"vjs-flash-fallback\" width=\"#{width}\" height=\"#{height}\" type=\"application/x-shockwave-flash\" data=\"http://releases.flowplayer.org/swf/flowplayer-3.2.1.swf\">"+
	    					"<param name=\"movie\" value=\"http://releases.flowplayer.org/swf/flowplayer-3.2.1.swf\" />"+
	    					"<param name=\"allowfullscreen\" value=\"true\" />"+
	    					"<param name=\"flashvars\" value='config={\"playlist\":[{\"url\": \"#{source}\",\"autoPlay\":true,\"autoBuffering\":true}]}' />"+
	  					"</object>"+
					"</video>"+
					"<p class=\"vjs-no-video\"><strong>Download Video:</strong>"+
						"<a href=\"http://videojs.com\">HTML5 Video Player</a> by VideoJS"+
					"</p>"+
				"</div>"

}, window.LightboxOptions || {});

// -----------------------------------------------------------------------------------

var Lightbox = Class.create();

Lightbox.prototype = {
    contentArray: [],
    activeContent: undefined,
    
    // initialize()
    // Constructor runs on completion of the DOM loading. Calls updateImageList and then
    // the function inserts html at the bottom of the page which is used to display the shadow 
    // overlay and the image container.
    //
    initialize: function() {    
        
        this.updateImageList();
        
        this.keyboardAction = this.keyboardAction.bindAsEventListener(this);

        if (LightboxOptions.resizeSpeed > 10) LightboxOptions.resizeSpeed = 10;
        if (LightboxOptions.resizeSpeed < 1)  LightboxOptions.resizeSpeed = 1;

	    this.resizeDuration = LightboxOptions.animate ? ((11 - LightboxOptions.resizeSpeed) * 0.15) : 0;
	    this.overlayDuration = LightboxOptions.animate ? 0.2 : 0;  // shadow fade in/out duration

        // When Lightbox starts it will resize itself from 250 by 250 to the current image dimension.
        // If animations are turned off, it will be hidden as to prevent a flicker of a
        // white 250 by 250 box.
        var size = (LightboxOptions.animate ? 250 : 1) + 'px';
        

        // Code inserts html at the bottom of the page that looks similar to this:
        //
        //  <div id="overlay"></div>
        //  <div id="lightbox">
        //      <div id="outerContentContainer">
        //          <div id="contentContainer">
		//				<div id="lbNav">
		//                  <a href="#" id="lbPrevLink"></a>
		//					<a href="#" id="lbCloseLink"></a>
        //                  <a href="#" id="lbNextLink"></a>
		//				</div>
		//              <div id="lightboxContent">
        //                  
		//              </div>
		//				<img id="lightboxImage"/>
        ////              <div style="" id="hoverNav">
        ////                  <a href="#" id="prevLink"></a>
        ////                  <a href="#" id="nextLink"></a>
        ////              </div>
        //              <div id="loading">
        //                  <a href="#" id="loadingLink">
        //                      <img src="images/loading.gif">
        //                  </a>
        //              </div>
        //          </div>
        //      </div>
        //      <div id="imageDataContainer">
        //          <div id="imageData">
        //              <div id="imageDetails">
        //                  <span id="caption"></span>
		//					<span id="description"></span>
        //                  <span id="numberDisplay"></span>
        //              </div>
        ////              <div id="bottomNav">
        ////                  <a href="#" id="bottomNavClose">
        ////                      <img src="images/close.gif">
        ////                  </a>
        ////              </div>
        //          </div>
        //      </div>
        //  </div>


        var objBody = $$('body')[0];

		objBody.appendChild(Builder.node('div',{id:'overlay'}));
	
        objBody.appendChild(Builder.node('div',{id:'lightbox'}, [
            Builder.node('div',{id:'outerContentContainer'}, 
                Builder.node('div',{id:'contentContainer'}, [
      					Builder.node('div',{'id': 'lbNav', 'class':'lb-clearfix'}, [
      						Builder.node('a',{'id':'lbPrevLink', href: '#' }),
      						Builder.node('a',{'id':'lbCloseLink', href: '#' }),
                              Builder.node('a',{ 'id':'lbNextLink', href: '#' })
      					  ]), 
      					  Builder.node('div',{id:'lightboxContent'}, []), 
      					  Builder.node('img',{id:'lightboxImage'}),
                  Builder.node('div',{id:'loading'}, 
                      Builder.node('a',{id:'loadingLink', href: '#', 'class':'lb' }, 
                          []//Builder.node('img', {src: LightboxOptions.fileLoadingImage})
                      )
                  )
                ]) //contentContainer
            ),
            Builder.node('div', {id:'imageDataContainer'},
                Builder.node('div',{id:'imageData'}, [
                    Builder.node('div',{id:'imageDetails'}, [
                        Builder.node('span',{id:'caption'}),
                        Builder.node('span',{id:'numberDisplay'}),
						Builder.node('span',{id:'description'})
                    ]),
                    //Builder.node('div',{id:'bottomNav'},
                    //    Builder.node('a',{id:'bottomNavClose', href: '#' , 'class':'lb' },
                    //        Builder.node('img', { src: LightboxOptions.fileBottomNavCloseImage })
                    //    )
                    //)
                ])
            )
        ]));
		objBody.appendChild(Builder.node('div',{id:'lightboxTemp'}));


		$('overlay').hide().observe('click', (function() { this.end(); }).bind(this));
		$('lightbox').hide().observe('click', (function(event) { if (event.element().id == 'lightbox') this.end(); }).bind(this));
		$('outerContentContainer').setStyle({ width: size, height: size });
		$('lbPrevLink').observe('click', (function(event) { event.stop(); this.changeContent(this.activeContent - 1); }).bindAsEventListener(this));
		$('lbNextLink').observe('click', (function(event) { event.stop(); this.changeContent(this.activeContent + 1); }).bindAsEventListener(this));
		$('loadingLink').observe('click', (function(event) { event.stop(); this.end(); }).bind(this));
		$('lbCloseLink').observe('click', (function(event) { event.stop(); this.end(); }).bind(this));

        var th = this;
        (function(){
            var ids = 
                'overlay lightbox outerContentContainer contentContainer lightboxContent lightboxImage hoverNav lbNav lbPrevLink lbNextLink lbCloseLink loading loadingLink ' + 
                'imageDataContainer imageData imageDetails caption numberDisplay description bottomNav bottomNavClose lightboxTemp';   
            $w(ids).each(function(id){ th[id] = $(id); });
        }).defer();
    },

    //
    // updateImageList()
    // Loops through anchor tags looking for 'lightbox' references and applies onclick
    // events to appropriate links. You can rerun after dynamically adding images w/ajax.
    //
    updateImageList: function() {   
        this.updateImageList = Prototype.emptyFunction;

        document.observe('click', (function(event){
            var target = event.findElement('a[rel^=lightbox]') || event.findElement('area[rel^=lightbox]');
            if (target) {
                event.stop();
                this.start(target);
            }
        }).bind(this));
		
		//Now hide any inline content that will be handled by the lightbox
		var inlines = $$('a[rel^=lightbox][href^=#]');
		inlines.each(function(link){
			if(this.fileType(link.href) == "inline"){
				$(this.getAnchor(link.href)).hide();
			}
		}.bind(this));
    },
    
    //
    //  start()
    //  Display overlay and lightbox. If image is part of a set, add siblings to contentArray.
    //
    start: function(imageLink) {    
        
		this.hideProblemElements();
		
        // stretch overlay to fill page and fade in
        var arrayPageSize = this.getPageSize();
        $('overlay').setStyle({ width: arrayPageSize[0] + 'px', height: arrayPageSize[1] + 'px' });

        new Effect.Appear(this.overlay, { duration: this.overlayDuration, from: 0.0, to: LightboxOptions.overlayOpacity });

        this.contentArray = [];
        var imageNum = 0;       

        if ((imageLink.rel == 'lightbox')){
            // if image is NOT part of a set, add single image to contentArray
            this.contentArray.push([imageLink.href, imageLink.title, imageLink.getAttribute('description'), this.parseParams(imageLink.getAttribute('params')) ]);         
        } else {
            // if image is part of a set..
            this.contentArray = 
                $$(imageLink.tagName + '[href][rel="' + imageLink.rel + '"]').
                collect(function(anchor){ return [anchor.href, anchor.title, anchor.getAttribute('description'), this.parseParams(anchor.getAttribute('params')) ]; }.bind(this)).
                uniq();
            
            while (this.contentArray[imageNum][0] != imageLink.href) { imageNum++; }
        }

        // calculate top and left offset for the lightbox 
        var arrayPageScroll = document.viewport.getScrollOffsets();
        var lightboxTop = arrayPageScroll[1] + (document.viewport.getHeight() / 10);
        var lightboxLeft = arrayPageScroll[0];
        this.lightbox.setStyle({ top: lightboxTop + 'px', left: lightboxLeft + 'px' }).show();
        
        this.changeContent(imageNum);
    },

	//
	//  parse the params attribute of a link
	parseParams : function(params){
		if(params == null) return {}
		var paramHash = {};
		var parameterArray = params.split(';');
		parameterArray.each(function(pair){
			pair = pair.split('=')
			paramHash[pair[0]] = pair[1]
		});
		return paramHash;
	},


	changeContent : function(linkNum){
		this.activeContent = linkNum; // update global var
		this.hideControls();
		
		var url = this.contentArray[linkNum][0];
		if(this.fileType(url) == "image"){
			this.changeImage(linkNum);
		}else if(this.fileType(url) == "page" && this.contentArray[linkNum][3].content_mode=="iframe" ){
			this.changeIFrame(linkNum);
		}else if(this.fileType(url) == "page" ){
			this.changePage(linkNum);
	    }else if(this.fileType(url) == "inline"){
			this.changeInline(linkNum);
		 }else if(this.fileType(url) == "video"){
			this.changeVideo(linkNum);
		}else{
		    // we're down to something unknown.  Let's see if it matches a known video embedding site.
		    var videoObjURL = this.parseVideoURL(url);
		    if(videoObjURL){
		        this.changeEmbed(linkNum);
		    }else{
		        //we really don't know about this
		        //we'll just punt it into an iframe
		        this.changeIFrame(linkNum);
			    //alert("We can't handle this url : " + url + " - " + this.fileType(url));
	        }
		}
	},


    //
	//  changeVideo()
	//  Hide most elements and load up some video!
	//
	changeEmbed : function(imageNum){
	    
		var videoObjURL = this.parseVideoURL(this.contentArray[imageNum][0]);
	    
	    
	  var w = parseInt(this.contentArray[imageNum][3]['lightbox_width']) || LightboxOptions.defaultWidth; //+(this.options.contentOffset.height);
		var h = parseInt(this.contentArray[imageNum][3]['lightbox_height']) || LightboxOptions.defaultHeight;//+(this.options.contentOffset.width);
		this.lightboxContent.innerHTML = '<object id="lbVideoObject" standby="loading video..." type="application/x-shockwave-flash" width="'+
		                                    w+'" height="'+h+'" data="'+videoObjURL+'">'+
		                                        '<param name="movie" value="'+videoObjURL+'" /><param name="bgcolor" value="#fff" />'+
		                                        '<param name="allowFullScreen" value="true" /><param name="wmode" value="window" /><param name="allowScriptAccess" value="always" />'+
		                                 '</object>'
		this.resizeContentContainer( w,h );
		
	},

	//
	//  changeVideo()
	//  Hide most elements and load up some video!
	//
	changeVideo : function(imageNum){
		
		
		var w = parseInt(this.contentArray[imageNum][3]['lightbox_width']) || this.lightboxTemp.getWidth();//+(this.options.contentOffset.height);
		var h = parseInt(this.contentArray[imageNum][3]['lightbox_height']) || this.lightboxTemp.getHeight();//+(this.options.contentOffset.width);
		
		/*var embed = "<div class=\"video-js-box\">"+
    					"<video id=\"lbVideo\" class=\"video-js\" width=\"640\" height=\"264\" controls preload autoplay>"+
							"<source src= sr\"http://video-js.zencoder.com/oceans-clip.mp4\" type='video/mp4; codecs=\"avc1.42E01E, mp4a.40.2\"' />"+
							"<source src=\"http://video-js.zencoder.com/oceans-clip.webm\" type='video/webm; codecs=\"vp8, vorbis\"' />" +
      						"<source src=\"http://video-js.zencoder.com/oceans-clip.ogv\" type='video/ogg; codecs=\"theora, vorbis\"' />" +
      						"<object id=\"flash_fallback_1\" class=\"vjs-flash-fallback\" width=\"640\" height=\"264\" type=\"application/x-shockwave-flash\" data=\"http://releases.flowplayer.org/swf/flowplayer-3.2.1.swf\">"+
	        					"<param name=\"movie\" value=\"http://releases.flowplayer.org/swf/flowplayer-3.2.1.swf\" />"+
	        					"<param name=\"allowfullscreen\" value=\"true\" />"+
	        					"<param name=\"flashvars\" value='config={\"playlist\":[{\"url\": \"http://video-js.zencoder.com/oceans-clip.mp4\",\"autoPlay\":true,\"autoBuffering\":true}]}' />"+
	      					"</object>"+
    					"</video>"+
    					"<p class=\"vjs-no-video\"><strong>Download Video:</strong>"+
      					"<a href=\"http://videojs.com\">HTML5 Video Player</a> by VideoJS"+
    					"</p>"+
  					"</div>";
		*/
		var sources = this.buildSourceString(imageNum); "<source src=\""+this.contentArray[imageNum][0]+"\" type='video/mp4; codecs=\"avc1.42E01E, mp4a.40.2\"' />";
		var embed = LightboxOptions.videoEmbed.gsub('#{source}',this.contentArray[imageNum][0]);
		embed = embed.gsub('#{sources}',sources)
		embed = embed.gsub('#{width}',w)
		embed = embed.gsub('#{height}',h)
		this.lightboxContent.innerHTML = embed;	
		
		this.resizeContentContainer( w,h );
	},
	
	//
	//  buildSourceString()
	//  Builds a list of <source> tags for videos
	//
	buildSourceString : function(imageNum){
		var ss = "";
		ss += this.singleSourceString(this.contentArray[imageNum][0]);
		
		var sources = this.contentArray[imageNum][3].alt_src.split(',');
		sources.each(function(src){
				ss +=  this.singleSourceString(src);
		}.bind(this));
		/*this.contentArray[imageNum][3].each(function(pair){
			if(pair.key == 'src'){
				ss +=  this.singleSourceString(pair.value);
			}
		}.bind(this));
		*/
		return ss;
	},

	singleSourceString : function(url){
		var ext = this.getFileExtension(url);
		var ss = "<source src='"+url+"' type='"+LightboxOptions.mimeTypes[ext]+"; codecs=\""+LightboxOptions.codecs[ext]+"\"'/>";
		return ss;
	},

	//
	//  changeInline()
	//  Hide most elements and load content from an inline element
	//  
	changeInline: function(imageNum){

		this.lightboxTemp.innerHTML = $(this.getAnchor(this.contentArray[imageNum][0])).innerHTML;
		var w = parseInt(this.contentArray[imageNum][3]['lightbox_width']) || this.lightboxTemp.getWidth();//+(this.options.contentOffset.height);
		var h = parseInt(this.contentArray[imageNum][3]['lightbox_height']) || this.lightboxTemp.getHeight();//+(this.options.contentOffset.width);
		this.lightboxContent.innerHTML =  this.lightboxTemp.innerHTML;
		this.resizeContentContainer( w,h );
	},


	//
	//  changePage()
	//  Hide most elements and load content into an iframe
	//  
	changeIFrame: function(imageNum){
	
		var w = parseInt(this.contentArray[imageNum][3]['lightbox_width']) || LightboxOptions.defaultWidth; //+(this.options.contentOffset.height);
		var h = parseInt(this.contentArray[imageNum][3]['lightbox_height']) || LightboxOptions.defaultHeight;//+(this.options.contentOffset.width);
		this.lightboxContent.innerHTML =  "<iframe src='"+this.contentArray[imageNum][0]+"' frameborder='0' width='"+w+"' height='"+h+"'></iframe>";
		this.resizeContentContainer( w,h );
	
	},

	//
	//  changePage()
	//  Hide most elements and load content into an iframe
	//  
	changePage: function(imageNum){
		
		//this.lightboxImage.src = "";
		var newAJAX = new Ajax.Request(
				this.contentArray[this.activeContent][0], {
					method: 'get', 
					parameters: '', 
					onComplete: function(response) {
						this.lightboxTemp.innerHTML = response.responseText;
						//var layout =  this.lightboxContent.getLayout();
						//layout.get('width'),layout.get('height') 
						var w = parseInt(this.contentArray[imageNum][3]['lightbox_width']) || this.lightboxTemp.getWidth();//+(this.options.contentOffset.height);
						var h = parseInt(this.contentArray[imageNum][3]['lightbox_height']) || this.lightboxTemp.getHeight();//+(this.options.contentOffset.width);
						this.lightboxContent.innerHTML =  response.responseText;
						this.resizeContentContainer( w,h );
						//this._processWindow();
					}.bind(this)
				}
			);
	},
	
    //
    //  changeImage()
    //  Hide most elements and preload image in preparation for resizing image container.
    //
    changeImage: function(imageNum) {   
        
        
        
        var imgPreloader = new Image();
		
        // once image is preloaded, resize image container
        imgPreloader.onload = (function(){
            this.lightboxImage.src = this.contentArray[this.activeContent][0];
            this.resizeContentContainer(imgPreloader.width, imgPreloader.height);
        }).bind(this);
        imgPreloader.src = this.contentArray[this.activeContent][0];
    },

	//
	// hideControls()
	// Hide most elements and
	//  
	hideControls : function(){
		// hide elements during transition
        if (LightboxOptions.animate) this.loading.show();
		this.lightboxContent.update("");
		this.lightboxContent.hide();
        this.lightboxImage.hide();
        //this.hoverNav.hide();
		this.lbNav.hide();
        this.lbPrevLink.style.visibility = 'hidden' ; //hide();
        this.lbNextLink.style.visibility = 'hidden' ;//hide();
		// HACK: Opera9 does not currently support scriptaculous opacity and appear fx
        this.imageDataContainer.setStyle({opacity: .0001});
        this.numberDisplay.hide(); 
	},

    //
    //  resizeContentContainer()
    //
    resizeContentContainer: function(imgWidth, imgHeight) {
	

        // get current width and height
        var widthCurrent  = this.outerContentContainer.getWidth();
        var heightCurrent = this.outerContentContainer.getHeight();

        // get new width and height
        var widthNew  = (imgWidth  + LightboxOptions.borderSize * 2);
        var heightNew = (imgHeight + LightboxOptions.borderSize * 2);

        // scalars based on change from old to new
        var xScale = (widthNew  / widthCurrent)  * 100;
        var yScale = (heightNew / heightCurrent) * 100;

        // calculate size difference between new and old image, and resize if necessary
        var wDiff = widthCurrent - widthNew;
        var hDiff = heightCurrent - heightNew;

        //if (hDiff != 0) new Effect.Scale(this.outerContentContainer, yScale, {scaleX: false, duration: this.resizeDuration, queue: 'front'}); 
        //if (wDiff != 0) new Effect.Scale(this.outerContentContainer, xScale, {scaleY: false, duration: this.resizeDuration, delay: this.resizeDuration}); 

		if( (hDiff != 0) || (wDiff != 0) ){
			
			new Effect.Morph(this.outerContentContainer,{
				style : { 'width' : widthNew + "px", 'height' : heightNew + "px"},
				duration: this.resizeDuration
			});
			/*new Effect.Scale(this.outerContentContainer, 100, {
				scaleMode: {
					originalHeight: heightNew,
					originalWidth: widthNew
				},
				duration: this.resizeDuration,
				queue: 'front'
			});*/
		}

        // if new and old image are same size and no scaling transition is necessary, 
        // do a quick pause to prevent image flicker.
        var timeout = 0;
        if ((hDiff == 0) && (wDiff == 0)){
            timeout = 100;
            if (Prototype.Browser.IE) timeout = 250;   
        }

        (function(){
            //this.prevLink.setStyle({ height: imgHeight + 'px' });
            //this.nextLink.setStyle({ height: imgHeight + 'px' });
            this.imageDataContainer.setStyle({ width: (widthNew) + 'px' });
			
            
			this.showContent();
			
		}).bind(this).delay(timeout / 1000);
    },
    
	
	
	
    //
    //  showContent()
    //  Display image and begin preloading neighbors.
    //
    showContent: function(){
        this.loading.hide();
		if (this.fileType(this.contentArray[this.activeContent][0]) == 'image') {
			new Effect.Appear(this.lightboxImage, {
				duration: this.resizeDuration,
				queue: 'end',
				afterFinish: (function(){
					this.updateDetails();
				}).bind(this)
			});
		}else {
			new Effect.Appear(this.lightboxContent, {
				duration: this.resizeDuration,
				queue: 'end',
				afterFinish: (function(){
					this.updateDetails();
					if(this.fileType(this.contentArray[this.activeContent][0]) == 'video'){
						VideoJS.setup('lbVideo');
					}
				}).bind(this)
			});
		}
        this.preloadNeighborImages();
    },

    //
    //  updateDetails()
    //  Display caption, image number, and bottom nav.
    //
    updateDetails: function() {
    
        // if caption is not null
        if (this.contentArray[this.activeContent][1] != ""){
            this.caption.update(this.contentArray[this.activeContent][1]).show();
        }else{
			this.caption.update("");
		}
		
		// if description is not null
        if (this.contentArray[this.activeContent][2] != ""){
            this.description.update(this.contentArray[this.activeContent][2]).show();
        }
		
        
        // if image is part of set display 'Image x of x' 
        if (this.contentArray.length > 1){
            //this.numberDisplay.update( LightboxOptions.labelImage + ' ' + (this.activeContent + 1) + ' ' + LightboxOptions.labelOf + '  ' + this.contentArray.length).show();
			this.numberDisplay.update( (this.activeContent + 1) + ' ' + LightboxOptions.labelOf + '  ' + this.contentArray.length).show();
        }
		
		this.updateNav();
		this.lbNav.style.top = "0px";
		
		
        new Effect.Parallel(
            [ 
                new Effect.SlideDown(this.imageDataContainer, { sync: true, duration: this.resizeDuration, from: 0.0, to: 1.0 }),
				new Effect.Move(this.lbNav, { sync: true, duration: this.resizeDuration, from: 0.0, to: 1.0, y:-25, x : "50%" }), 
                new Effect.Appear(this.lbNav, { sync: true, duration: this.resizeDuration }), 
			    new Effect.Appear(this.imageDataContainer, { sync: true, duration: this.resizeDuration }) 
            ], 
            { 
                duration: this.resizeDuration, 
                afterFinish: (function() {
	                // update overlay size and update nav
	                var arrayPageSize = this.getPageSize();
	                this.overlay.setStyle({ height: arrayPageSize[1] + 'px' });
	                
                }).bind(this)
            } 
        );
    },

    //
    //  updateNav()
    //  Display appropriate previous and next hover navigation.
    //
    updateNav: function() {

        //this.hoverNav.show();               

        // if not first image in set, display prev image button
        if (this.activeContent > 0) this.lbPrevLink.style.visibility = 'visible';

        // if not last image in set, display next image button
        if (this.activeContent < (this.contentArray.length - 1)) this.lbNextLink.style.visibility = 'visible';
        
        this.enableKeyboardNav();
    },

    //
    //  enableKeyboardNav()
    //
    enableKeyboardNav: function() {
        document.observe('keydown', this.keyboardAction); 
    },

    //
    //  disableKeyboardNav()
    //
    disableKeyboardNav: function() {
        document.stopObserving('keydown', this.keyboardAction); 
    },

    //
    //  keyboardAction()
    //
    keyboardAction: function(event) {
        var keycode = event.keyCode;

        var escapeKey;
        if (event.DOM_VK_ESCAPE) {  // mozilla
            escapeKey = event.DOM_VK_ESCAPE;
        } else { // ie
            escapeKey = 27;
        }

        var key = String.fromCharCode(keycode).toLowerCase();
        
        if (key.match(/x|o|c/) || (keycode == escapeKey)){ // close lightbox
            this.end();
        } else if ((key == 'p') || (keycode == 37)){ // display previous image
            if (this.activeContent != 0){
                this.disableKeyboardNav();
                this.changeContent(this.activeContent - 1);
            }
        } else if ((key == 'n') || (keycode == 39)){ // display next image
            if (this.activeContent != (this.contentArray.length - 1)){
                this.disableKeyboardNav();
                this.changeContent(this.activeContent + 1);
            }
        }
    },

    //
    //  preloadNeighborImages()
    //  Preload previous and next images.
    //
    preloadNeighborImages: function(){
        var preloadNextImage, preloadPrevImage;
        if (this.contentArray.length > this.activeContent + 1){
            preloadNextImage = new Image();
            preloadNextImage.src = this.contentArray[this.activeContent + 1][0];
        }
        if (this.activeContent > 0){
            preloadPrevImage = new Image();
            preloadPrevImage.src = this.contentArray[this.activeContent - 1][0];
        }
    
    },

    //
    //  end()
    //
    end: function() {
        this.disableKeyboardNav();
        // make sure that a video goes away if it's playing
		this.lightboxContent.innerHTML = "";
		
		this.lightbox.hide();
        new Effect.Fade(this.overlay, { duration: this.overlayDuration });
        this.showProblemElements();
    },

	hideProblemElements : function(){
		$$('select', 'object', 'embed').each(function(node){ node.style.visibility = 'hidden' });
	},
	
	showProblemElements : function(){
		$$('select', 'object', 'embed').each(function(node){ node.style.visibility = 'visible' });
	},

    //
    //  getPageSize()
    //
    getPageSize: function() {
	        
	     var xScroll, yScroll;
		
		if (window.innerHeight && window.scrollMaxY) {	
			xScroll = window.innerWidth + window.scrollMaxX;
			yScroll = window.innerHeight + window.scrollMaxY;
		} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
			xScroll = document.body.scrollWidth;
			yScroll = document.body.scrollHeight;
		} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
			xScroll = document.body.offsetWidth;
			yScroll = document.body.offsetHeight;
		}
		
		var windowWidth, windowHeight;
		
		if (self.innerHeight) {	// all except Explorer
			if(document.documentElement.clientWidth){
				windowWidth = document.documentElement.clientWidth; 
			} else {
				windowWidth = self.innerWidth;
			}
			windowHeight = self.innerHeight;
		} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
			windowWidth = document.documentElement.clientWidth;
			windowHeight = document.documentElement.clientHeight;
		} else if (document.body) { // other Explorers
			windowWidth = document.body.clientWidth;
			windowHeight = document.body.clientHeight;
		}	
		
		// for small pages with total height less then height of the viewport
		if(yScroll < windowHeight){
			pageHeight = windowHeight;
		} else { 
			pageHeight = yScroll;
		}
	
		// for small pages with total width less then width of the viewport
		if(xScroll < windowWidth){	
			pageWidth = xScroll;		
		} else {
			pageWidth = windowWidth;
		}

		return [pageWidth,pageHeight];
	},
	
	/*
	* A few functions borrowed from lightwindow
	* http://www.p51labs.com/lightwindow/
	*/
	
	// determine the file type of a url
	fileType : function(url){
		var image = new RegExp("[^\.]\.("+LightboxOptions.fileTypes.image.join('|')+")\s*$", "i");
		if (image.test(url)) return 'image';
		var video = new RegExp("[^\.]\.("+LightboxOptions.fileTypes.video.join('|')+")\s*$", "i");
		if (video.test(url)) return 'video';
		var page = new RegExp("[^\.]\.("+LightboxOptions.fileTypes.page.join('|')+")\s*$", "i");
		if (page.test(url) || url.substr((url.length-1), url.length) == '/') return 'page';
		if (url.indexOf('#') > -1 && (document.domain == this.getDomain(url))) return 'inline';
		return "unknown";
	},
	
	//
	// Get the anchor portion of a URL
	//
	getAnchor : function(url){
		var content = url
		if (content.indexOf('?') > -1) {
			content = content.substring(0, content.indexOf('?'));
		}
		content = content.substring(content.indexOf('#')+1);
		return content;
	},
	
	//
	//	Get the file extension from a string.
	//
	getFileExtension : function(url) {
		if (url.indexOf('?') > -1) {
			url = url.substring(0, url.indexOf('?'));
		}
		var extenstion = '';
		for (var x = (url.length-1); x > -1; x--) {
			if (url.charAt(x) == '.') {
				return extenstion;
			}
			extenstion = url.charAt(x)+extenstion;
		}
	},
	
	//
	//	Get the domain from a string.
	//
	getDomain : function(url) {    
        var leadSlashes = url.indexOf('//');
        var domainStart = leadSlashes+2;
        var withoutResource = url.substring(domainStart, url.length);
        var nextSlash = withoutResource.indexOf('/');
        var domain = withoutResource.substring(0, nextSlash);
		if (domain.indexOf(':') > -1){
			var portColon = domain.indexOf(':');
			domain = domain.substring(0, portColon);
       	}
		return domain;
    },
    
    /*
     *  Taken from Flower
     *  https://github.com/cashmusic/Flower
     */
    parseVideoURL: function(url) {
		/*
		Function parseVideoURL(url url)
		
		Accepts a URL, checks for validity against popular video sharing sites, and
		returns a direct URL for the embeddable SWF based on that site's standard
		format. Returns false if no known format is found.
		
		Supports: youtube.com links
				  google video links
				  vimeo.com links
		
		*/
		var newUrl = false,
			urlLc = url.toLowerCase(),
			miscVar;
		if (urlLc.include('youtube.com/watch?v=')) {
			newUrl = url.replace(/watch\?v\=/i,'v/');
			miscVar = newUrl.indexOf('&');
			if (miscVar > -1) {newUrl = newUrl.substr(0,miscVar);}
			newUrl += '&amp;autoplay=1';
		} else if (urlLc.include('fuseaction=vids.individual&videoid=')) {
			newUrl = 'http://lads.myspace.com/videos/vplayer.swf?m=';
			miscVar = urlLc.lastIndexOf('=')+1;
			newUrl += urlLc.substr(miscVar,urlLc.length - miscVar);
			newUrl += '&v=2&type=video&a=1';
		} else if (urlLc.include('video.google.com/videoplay?docid=')) {
			newUrl = url.replace(/videoplay/i,'googleplayer.swf');
			miscVar = newUrl.indexOf('&');
			if (miscVar > -1) {newUrl = newUrl.substr(0,miscVar);}
		} else if (urlLc.include('vimeo.com/')) {
			newUrl = url.replace('vimeo.com/','vimeo.com/moogaloop.swf?clip_id=');
			newUrl += '&amp;server=vimeo.com&amp;fullscreen=1&amp;show_title=1&amp;show_byline=1&amp;show_portrait=0&amp;js_api=1&amp;autoplay=1';
		} else if (urlLc.include('vevo.com/watch')) {
			newUrl = 'http://www.vevo.com/VideoPlayer/Embedded?videoId=';
			miscVar = urlLc.lastIndexOf('/')+1;
			newUrl += urlLc.substr(miscVar,urlLc.length - miscVar);
			newUrl += '&autoplay=1&playerType=embedded&playlist=false';
		} 
		return newUrl;
	},
}

document.observe('dom:loaded', function () { new Lightbox(); });
