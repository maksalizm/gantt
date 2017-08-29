(function($) {
    $('#create_gantt').modal('show');

    $("#create_project").on('hidden.bs.modal', function() {
        $('#modalProjectName').val('');
        $('#modalProjectStart').val('');
        $('#modalProjectEnd').val('');
    })
    var sourceData = window.ganttData.sourceData;
    var ganttOptions = {
        source: sourceData,
        dow: ["일", "월", "화", "수", "목", "금", "토"],
        navigate: "scroll",
        scale: "days",
        maxScale: "year",
        minScale: "days",
        itemsPerPage: sourceData.length,
        onItemClick: function (dataObj, dt) {
            var self = this;
            var ganttId = $('#gantt').data().id;
            this.source.forEach(function (data, index, array) {
                if (data.id === dataObj.parentId && !data.isCreated && array[index].values[0].from < dt) {
                    data.values[0].to = dt;
                    $('.gantt').gantt({
                        source: self.source,
                        dow: self.dow,
                        navigate: self.navigate,
                        scale: self.scale,
                        maxScale: self.maxScale,
                        itemsPerPage: self.itemsPerPage,
                        onAddClick: self.onAddClick,
                        onRender: self.onRender,
                        onItemClick: self.onItemClick
                    });
                    if (data.isProject) {
                        $.ajax({
                            url: '/gantt/' + ganttId,
                            method: 'post',
                            data: {
                                dataUpdate: true,
                                projectId: dataObj.parentId,
                                to: dt,
                                isProject: true
                            }
                        });
                    } else {
                        $.ajax({
                            url: '/gantt/' + ganttId,
                            method: 'post',
                            data: {
                                dataUpdate: true,
                                projectId: data.projectId,
                                taskId: dataObj.parentId,
                                to: dt,
                                isProject: false
                            }
                        });
                    }
                } else if ("" + data.id === "" + dataObj.parentId && data.isCreated) {
                    if (!data.values[0].from) {
                        data.values[0].from = dt;
                        $.ajax({
                            url: '/gantt/' + ganttId,
                            method: 'post',
                            data: {
                                dataUpdate: true,
                                projectId: data.projectId,
                                taskId: dataObj.parentId,
                                from: dt,
                                dataType: 'from',
                                isProject: false
                            }
                        });
                    } else if(array[index].values[0].from < dt) {
                        data.values[0].to = dt;
                        $('.gantt').gantt({
                            source: self.source,
                            dow: self.dow,
                            navigate: self.navigate,
                            scale: self.scale,
                            maxScale: self.maxScale,
                            itemsPerPage: self.itemsPerPage,
                            onAddClick: self.onAddClick,
                            onRender: self.onRender,
                            onItemClick: self.onItemClick
                        });
                        $.ajax({
                            url: '/gantt/' + ganttId,
                            method: 'post',
                            data: {
                                dataUpdate: true,
                                projectId: data.projectId,
                                taskId: dataObj.parentId,
                                to: dt,
                                isProject: false,
                                dataType: 'to'
                            }
                        });
                    }
                }
            });
        },
        onDeleteClick: function (dt) {

        },
        onAddClick: function (e, dt, rowId) {
            var self = this;
            var ganttId = $('#gantt').data().id;
            this.source.forEach(function (data, index, array) {
                if (data.id === rowId && !data.isCreated && array[index].values[0].from < dt) {
                    data.values[0].to = dt;
                    $('.gantt').gantt({
                        source: self.source,
                        dow: self.dow,
                        navigate: self.navigate,
                        scale: self.scale,
                        maxScale: self.maxScale,
                        itemsPerPage: self.itemsPerPage,
                        onAddClick: self.onAddClick,
                        onRender: self.onRender,
                        onItemClick: self.onItemClick
                    });
                    if (data.isProject) {
                        $.ajax({
                            url: '/gantt/' + ganttId,
                            method: 'post',
                            data: {
                                dataUpdate: true,
                                projectId: rowId,
                                to: dt,
                                isProject: true
                            }
                        });
                    } else {
                        $.ajax({
                            url: '/gantt/' + ganttId,
                            method: 'post',
                            data: {
                                dataUpdate: true,
                                projectId: data.projectId,
                                taskId: rowId,
                                to: dt,
                                isProject: false
                            }
                        });
                    }
                } else if ("" + data.id === "" + rowId && data.isCreated) {
                    if (!data.values[0].from) {
                        var $taskElem = $('#RowdId_'+ index) || '';
                        var $projectElem = $('#rowheader' + index) || '';
                        var top = $projectElem.data().offset + 24 * 4 + 3;
                        var $pin = $('<i id="map_pin" class="fa fa-map-pin" aria-hidden="true"/>');
                        var left = $('#dh-' + dt).data().offset;
                        $pin.css({
                            top: top,
                            left: left + 8,
                            position: 'absolute'
                        });
                        $('.dataPanel').append($pin);
                        data.values[0].from = dt;
                        if ($taskElem.text().length) {
                            data.values[0].label = $taskElem.text();
                        } else {
                            data.values[0].label = $projectElem.text();
                        }
                        $.ajax({
                            url: '/gantt/' + ganttId,
                            method: 'post',
                            data: {
                                dataUpdate: true,
                                projectId: data.projectId,
                                taskId: rowId,
                                from: dt,
                                dataType: 'from',
                                isProject: false
                            }
                        });
                    } else if(array[index].values[0].from < dt) {
                        data.values[0].to = dt;
                        $('#map_pin').remove();
                        $('.gantt').gantt({
                            source: self.source,
                            dow: self.dow,
                            navigate: self.navigate,
                            scale: self.scale,
                            maxScale: self.maxScale,
                            itemsPerPage: self.itemsPerPage,
                            onAddClick: self.onAddClick,
                            onRender: self.onRender,
                            onItemClick: self.onItemClick
                        });
                        $.ajax({
                            url: '/gantt/' + ganttId,
                            method: 'post',
                            data: {
                                dataUpdate: true,
                                projectId: data.projectId,
                                taskId: rowId,
                                to: dt,
                                isProject: false,
                                dataType: 'to'
                            }
                        });
                    }
                }
            });
        },
        onRender: function () {

        }
    };

    $('#gantt').gantt(
        ganttOptions
    );
    $(document).on('click', '.addTask', function(e) {
        var $self = $(this);
        var $targetId = +$self.parents('.row').data().id;
        var projectId = $($self.parents()
                             .prevAll('.fn-wide')[0])
                             .data().id;
        $(sourceData).each(function(index, value) {
            if (value.id === $targetId) {
                sourceData.splice(index, 1);
            }
        });
        $self.replaceWith('<div style="width:100%;height: 100%;position:relative;background=color:#ffffff;">' +
            '<input style="width:80%;height: 100%;position:absolute;top:0;left:0;" id="taskName"/>' +
            '<button style="padding:2px;position:absolute;top: 3px; right: 3px;" class="fa fa-plus" data-project-id="'+projectId+'" type="button" id="addGanttTaskBtn"></button>'+
            '</div>');
    });

    $(document).on('click', '#addProject', function(e) {
        $('#create_project').modal('show');
    });

    $('#completeProjectBtn').on('click', function() {
        var ganttId = $('#gantt').data().id;
        $.ajax({
            method: 'post',
            url: '/gantt/' + ganttId,
            data: {
                projectName: $('#modalProjectName').val(),
                from: $('#modalProjectStart').val(),
                to: $('#modalProjectEnd').val(),
                dataType: 'newProject'
            },
            success: function(data) {
                sourceData.push({
                    id: data.projectId,
                    name: $('#modalProjectName').val(),
                    desc: '',
                    values: [
                        {
                            from: $('#modalProjectStart').val(),
                            to: $('#modalProjectEnd').val(),
                            dataObj: {
                                parentId: data.projectId
                            },
                            label: $('#modalProjectName').val(),
                            taskLength: 0,
                            isProject: true
                        }
                    ],
                    isCreated: true,
                    isProject: true,
                    taskLength: 0
                }, {
                    id: window.taskId++,
                    desc: 'add task',
                    values: [
                        {}
                    ],
                    isCreated: false,
                    isProject: false
                });
                ganttOptions.itemsPerPage = sourceData.length;
                $('#gantt').gantt(
                    ganttOptions
                );
                $('#create_project').modal('hide');
            }
        });
    });

    $(document).on('click', '#addGanttTaskBtn', function() {
        var $taskElem = $('#taskName');
        var targetData = $(this).data();
        var projectIndex = findDataByValue(sourceData, targetData.projectId);
        var immutableArray = sourceData.slice(0, projectIndex);
        var beforeArray = sourceData.slice(projectIndex, projectIndex + sourceData[projectIndex].taskLength + 1);
        var afterArray = sourceData.slice(projectIndex + sourceData[projectIndex].taskLength + 1, sourceData.length);

        processTaskData($taskElem, targetData.projectId, projectIndex);
        ++sourceData[projectIndex].taskLength;
        beforeArray.push({
            id: window.taskId,
            name: '',
            desc: $taskElem.val(),
            values: [
                {
                    dataObj: {
                        parentId: window.taskId++
                    }
                }
            ],
            isCreated: true,
            isProject: false,
            projectId: targetData.projectId
        }, {
            id: window.taskId++,
            desc: 'add task',
            values: [
                {}
            ],
            isCreated: false,
            isProject: false,
        });
        sourceData = immutableArray.concat(beforeArray, afterArray);
    });

    function processTaskData($taskElem, projectId, projectIndex) {
        var ganttId = $('#gantt').data().id;
        var promise = $.ajax({
            method: 'post',
            url: '/gantt/' + ganttId,
            data: {taskName: $taskElem.val(), projectId: projectId, dataUpdate: false}
        });
        promise.then(function(data) {
            if (data.success) {
                sourceData[
                findDataByValue(sourceData, projectId) +
                sourceData[findDataByValue(sourceData, projectId)].taskLength
                    ].id = data.taskId;
                ganttOptions.itemsPerPage = sourceData.length;
                ganttOptions.source = sourceData;
                $('#gantt').gantt(
                    ganttOptions
                );
            }
        });
    }
    $(document).on('click', '#addGanttProjectBtn', function() {
        var $taskElem = $('#projectName');
        sourceData.push({
            id: window.taskId,
            name: $taskElem.val(),
            desc: '',
            values: [
                {
                    dataObj: {
                        parentId: window.taskId++
                    }
                }
            ],
            taskLength: 0,
            isProject: true,
            isCreated: true
        });
        ganttOptions.itemsPerPage = sourceData.length;
        $('#gantt').gantt(
            ganttOptions
        );
    });
    $(document).on('click', '.delete-data', function(e) {
        var ganttId = $('#gantt').data().id;
        var $rowParentElem = $(e.target).closest('.row');
        var dataList = $rowParentElem.data();
        var parentId = dataList.id;
        var targetIndex = findDataByValue(sourceData, parentId);
        if ($rowParentElem.hasClass('name')) {
            sourceData.splice(targetIndex, targetIndex + sourceData[targetIndex].taskLength + 1);
            $.ajax({
                url: '/gantt/' + ganttId,
                method: 'delete',
                data: {
                    isProject: true,
                    projectId: parentId
                }
            });
        } else {
            var task = sourceData.splice(targetIndex, 1);
            $.ajax({
                url: '/gantt/' + ganttId,
                method: 'delete',
                data: {
                    isProject: false,
                    taskId: parentId,
                    projectId: task[0].projectId
                }
            });
        }
        $('#gantt').gantt(
            ganttOptions
        );
    });

    function findDataByValue(arr, value) {
        var arrLength = arr.length;
        for(var i = 0; i < arrLength; i++) {
            if (arr[i].id === value) {
                return i;
            }
        }
    }
}(jQuery));