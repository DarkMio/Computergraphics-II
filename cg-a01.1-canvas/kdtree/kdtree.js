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
                pointList.splice(median, 1);

                if(parent) {
                    if (dim) {
                        if (isLeft) {
                            node.bbox = new BoundingBox(parent.bbox.xmin, parent.bbox.ymin, parent.point.center[0], parent.bbox.ymax, node.point, 1);
                        } else {
                            node.bbox = new BoundingBox(node.point.center[0], parent.bbox.ymin, parent.bbox.xmax, parent.bbox.ymax, node.point, 1);
                        }
                    } else {
                        if (isLeft) {
                            node.bbox = new BoundingBox(parent.bbox.xmin, parent.bbox.ymin, parent.bbox.xmax, parent.point.center[1], node.point, 0);
                        } else {
                            node.bbox = new BoundingBox(parent.bbox.xmin, parent.point.center[1], parent.bbox.xmax, parent.bbox.ymax, node.point, 0);
                        }
                    }
                } else {
                    var canvas = document.getElementById('drawing_area');
                    node.bbox = new BoundingBox(0,0, canvas.width, canvas.height, node.point, dim);
                }
                pointList.splice(median, 1);

                if (pointList.length > 0){
                    var left = [];
                    var right = [];
                    for (var i = 0; i < pointList.length; i++){
                        if(pointList[i].center[dim] < node.point.center[dim]){
                            left.push(pointList[i]);
                        } else {
                            right.push(pointList[i]);
                        }
                    }
                    if(left.length > 0){
                        node.leftChild = this.build(left, 1 - dim, node, true);
                    };
                    if ( right.length > 0){
                        node.rightChild = this.build(right, 1 - dim, node, false);
                    };
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


