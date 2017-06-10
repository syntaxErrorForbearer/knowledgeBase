// clientside js
$(document).ready(function(){
  $('.delete-article').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/articles/'+id,
      success: function(response) {
        //alert('deleting article');
        window.location.href='/';
      },
      error: function(err) {
        console.log(err);
      }
    })
  });
});