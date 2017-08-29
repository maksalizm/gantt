(function($) {
    $('#create_gantt').modal('show');
    var $completeGanttBtn = $('#completeGanttBtn');
    // var sourceData = [];
    // var ganttOptions = {
    //     source: sourceData,
    //     dow: ["일", "월", "화", "수", "목", "금", "토"],
    //     navigate: "scroll",
    //     scale: "days",
    //     maxScale: "year",
    //     minScale: "days",
    //     itemsPerPage: 10,
    //     onItemClick: function (dataObj, dt) {
    //         var self = this;
    //         this.source.forEach(function (data) {
    //             if (data.id === dataObj.parentId && data.canEdit === 'true') {
    //                 var obj = {
    //                     from: moment(data.values[data.values.length - 1].to).format('YYYY-MM-DD'),
    //                     to: moment(dt).format('YYYY-MM-DD'),
    //                     customClass: data.values[0].customClass
    //                 };
    //                 data.values[0].to = dt;
    //                 $.ajax({
    //                     method: 'post',
    //                     data: {
    //                         values: JSON.stringify(obj),
    //                         dataId: dataObj.parentId
    //                     },
    //                     success: function (data) {
    //                         console.log(data);
    //                     }
    //                 })
    //             }
    //             if (data.id === dataObj.parentId) {
    //                 data.values[data.values.length - 1].to = dt;
    //             }
    //         });
    //
    //
    //         $('.gantt').gantt({
    //             source: self.source,
    //             dow: self.dow,
    //             navigate: self.navigate,
    //             scale: self.scale,
    //             maxScale: self.maxScale,
    //             itemsPerPage: self.itemsPerPage,
    //             onAddClick: self.onAddClick,
    //             onRender: self.onRender,
    //             onItemClick: self.onItemClick
    //         })
    //     },
    //     onDeleteClick: function (dt) {
    //
    //     },
    //     onAddClick: function (e, dt, rowId) {
    //         var self = this;
    //         this.source.forEach(function (data, index, array) {
    //             if (data.id === rowId && !data.isCreated && array[index - 1].values[0].to > dt) {
    //                 data.values[0].to = dt;
    //                 $('.gantt').gantt({
    //                     source: self.source,
    //                     dow: self.dow,
    //                     navigate: self.navigate,
    //                     scale: self.scale,
    //                     maxScale: self.maxScale,
    //                     itemsPerPage: self.itemsPerPage,
    //                     onAddClick: self.onAddClick,
    //                     onRender: self.onRender,
    //                     onItemClick: self.onItemClick
    //                 })
    //             }
    //             else if (+data.id === rowId && data.isCreated) {
    //                 if (!data.values[0].from) {
    //                     var top = $('#rowheader' + index).data().offset + 24 * 4 + 3;
    //                     var $pin = $('<i id="map_pin" class="fa fa-map-pin" aria-hidden="true"/>');
    //                     // elementFromPoint
    //                     var left = $('#dh-' + dt).data().offset;
    //                     $pin.css({
    //                         top: top,
    //                         left: left + 8,
    //                         position: 'absolute'
    //                     })
    //                     $('.dataPanel').append($pin)
    //                     data.values[0].from = dt;
    //                 } else {
    //                     data.values[0].to = dt;
    //                     $('#map_pin').remove();
    //                     $('.gantt').gantt({
    //                         source: self.source,
    //                         dow: self.dow,
    //                         navigate: self.navigate,
    //                         scale: self.scale,
    //                         maxScale: self.maxScale,
    //                         itemsPerPage: self.itemsPerPage,
    //                         onAddClick: self.onAddClick,
    //                         onRender: self.onRender,
    //                         onItemClick: self.onItemClick
    //                     })
    //                 }
    //             }
    //         })
    //     },
    //     onRender: function () {
    //         var self = this;
    //         $(document).off('click.addGantEvent', '#addGanttBtn');
    //         $(document).on('click.addGantEvent', '#addGanttBtn', function () {
    //             var taskName = $('#taskName').val();
    //             var taskDesc = $('#taskDesc').val()
    //             sourceData.push({
    //                 id: ++currentDataId + '',
    //                 name: taskName,
    //                 desc: taskDesc,
    //                 values: [{}],
    //                 canEdit: 'false',
    //                 isCreated: true
    //             })
    //             sourceData.push({
    //                 id: ++currentDataId,
    //                 name: '파트너 작업 진행 상황',
    //                 desc: '파트너 작업',
    //                 values: [{}],
    //                 isCreated: true
    //             })
    //             $('.gantt').gantt({
    //                 source: self.source,
    //                 dow: self.dow,
    //                 navigate: self.navigate,
    //                 scale: self.scale,
    //                 maxScale: self.maxScale,
    //                 itemsPerPage: sourceData.length,
    //                 onAddClick: self.onAddClick,
    //                 onRender: self.onRender,
    //                 onItemClick: self.onItemClick
    //             })
    //         })
    //     }
    // };

    $completeGanttBtn.on('click', function() {
        var formData = {};
        var $createGanttInputGroup = $('#createGantt').find('input');
        $createGanttInputGroup.each(function(index, elem){
            var $target = $(elem);
            formData[$target.attr('name')] = $target.val();
        });
    });
    $('#projectStart').datepicker({});
    $('#projectStart').on('changeDate', function (ev) {
        $(this).datepicker('hide');
    });
    $('#projectEnd').datepicker({});
    $('#projectEnd').on('changeDate', function (ev) {
        $(this).datepicker('hide');
    });
}(jQuery));