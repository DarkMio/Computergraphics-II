/*
 * JavaScript / Canvas teaching framwork
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: kdtree
 *
 *
 */


/* requireJS module definition */
define(["kdutil", "vec2", "Scene", "KdNode", "BoundingBox"],
    (function(KdUtil, vec2, Scene, KdNode, BoundingBox) {

        "use strict";

        /**
         * Creates a kd-tree. The build function is directly called
         * on generation
         *
         * @param pointList
         * @constructor
         */
        var KdTree = function (pointList) {

            /**
             *
             * @param pointList - list of points
             * @param dim       - current axis
             * @param parent    - current parent (starts with root)
             * @param isLeft    - flag if node is left or right child of its parent
             * @returns returns root node after tree is build
             */
            this.build = function(pointList, dim, parent, isLeft) {

                var node = new KdNode(dim);
                var median = KdUtil.sortAndMedian(pointList, dim);
                node.point = pointList[median];
                pointList.splice(median, 1); // Tagged & Bagged!
                
                if(!parent) { // is root, unsorted
                    var canvas = document.getElementById('drawing_area');
                    node.bbox = new BoundingBox(0, 0, canvas.width, canvas.height, node.point, dim);
                    console.log(canvas.height, canvas.width);
                } else { // Warning: Unreadable code ahead
                    // dim = 0 -> x, dim = 1 -> y
                    if(dim) { // y axis, replace x axis
                        if(isLeft) { // left side
                            node.bbox = new BoundingBox(
                                parent.bbox.xmin, parent.bbox.ymin,
                                parent.point.center[0], parent.bbox.ymax,
                                node.point, 1
                            );
                        } else { // right side
                            node.bbox = new BoundingBox(
                                parent.point.center[0], parent.bbox.ymin,
                                parent.bbox.xmax, parent.bbox.ymax,
                                node.point, 1
                            );
                        }
                    } else { // x axis, replace y axis
                        if(isLeft) { // left side
                            node.bbox = new BoundingBox(
                                parent.bbox.xmin, parent.bbox.ymin,
                                parent.bbox.xmax, parent.point.center[1],
                                node.point, 0
                            );
                        } else { // right side
                            node.bbox = new BoundingBox(
                                parent.bbox.xmin, parent.point.center[1],
                                parent.bbox.xmax, parent.bbox.ymax,
                                node.point, 0
                            );
                        }
                    }
                } // pyramid of doom: end

                if (pointList.length > 0){
                    var leftPoints = [];
                    var rightPoints = [];
                    for (var i = 0; i < pointList.length; i++){
                        if(pointList[i].center[dim] < node.point.center[dim]){
                            leftPoints.push(pointList[i]);
                        }else{
                            rightPoints.push(pointList[i]);
                        }
                    }

                    // call build for left/right arrays
                    if(leftPoints.length > 0) node.leftChild = this.build(leftPoints, 1 - dim, node, true);
                    if(rightPoints.length > 0) node.rightChild = this.build(rightPoints, 1 - dim, node, false);
                }

                return node;
            };

            /**
             * Given a query point the function return its nearest neighbor by traversing
             * down the tree
             *
             * @param node - current tree node
             * @param query - query node
             * @param nearestDistance - current nearest distance to query node
             * @param currentBest - current best/nearest node to query node
             * @param dim - current axis (x or y)
             * @returns closest tree node to query node
             */
            this.findNearestNeighbor = function(node, query, currentBest, nearestDistance, dim) {

                if( !node ) {
                    console.log("No node?");
                    return currentBest;
                }

                var closest = currentBest;
                var closestDistance = nearestDistance;

                var dist = KdUtil.distance(node.point.center, query.center);
                if( dist < nearestDistance ) {
                    closestDistance = dist;
                    closest = node;
                }

                var a, b;
                if (dim == 0) {
                    if ( query.center[0] < node.point.center[0]) {
                        a = node.leftChild;
                        b = node.rightChild;
                    } else {
                        a = node.rightChild;
                        b = node.leftChild;
                    }
                } else {
                    if (query.center[1] < node.point.center[1]) {
                        a = node.leftChild;
                        b = node.rightChild;
                    } else {
                        a = node.rightChild;
                        b = node.leftChild;
                    }
                }

                var nextDim = (dim === 0) ? 1 : 0;
                if( a && a.bbox.distanceTo(query.center) < closestDistance) {
                    closest = this.findNearestNeighbor(a, query, closest, closestDistance, nextDim);
                    closestDistance = KdUtil.distance(closest.point.center, query.center);
                }

                if( b && b.bbox.distanceTo(query.center) < closestDistance) {
                    closest = this.findNearestNeighbor(b, query, closest, closestDistance, nextDim);
                }

                return closest;
            };


            //
            this.root = this.build(pointList, 0);
            console.log(" this is the root: ", this.root);

        };

        return KdTree;


    })); // define


