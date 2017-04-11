/**
 * Created by cpro on 25.01.16.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendItemReview')
        .service('ChatService', ChatService);

    ChatService.$inject = ['Restangular', '$q'];

    function ChatService(Restangular, $q) {

        this.getChatTreeForPlanObject = getChatTreeForPlanObject;
        this.saveReply = saveReply;
        this.editReply = editReply;
        this.deleteReply = deleteReply;

        function getChatTreeForPlanObject(objId) {
            //var deferred = $q.defer();
            //deferred.resolve([
            //    {
            //        author: {
            //            id: 'f2d1d640-adc2-433a-a4ed-6ceba735f4ab',
            //            firstName: 'Sample',
            //            lastName: 'User'
            //        },
            //        message: "In the play performed for Sly, the 'shrew' is Katherina, the eldest daughter of Baptista Minola, a lord in Padua. Katherina's temper is notorious, and it is thought no man would ever wish to marry her. On the other hand, two men – Hortensio and Gremio – are eager to marry her younger sister Bianca. However, Baptista has sworn not to allow Bianca marry before Katherina is wed, much to the despair of her suitors, who agree to work together to marry off Katherina so they may freely compete for Bianca. The plot becomes more complex when Lucentio, who has recently come to Padua to attend university, falls in love with Bianca. Lucentio overhears Baptista announce he is on the lookout for tutors for his daughters, so he has his servant Tranio pretend to be him, while he disguises himself as a Latin tutor named Cambio, so he can woo Bianca behind Baptista's back.",
            //        receiver: {
            //            id: 'f2d1d640-adc2-433a-a4ed-6ceba735f4ab',
            //            firstName: 'Sample',
            //            lastName: 'Recepient'
            //        },
            //        messageId: 'id',
            //        replies: [
            //            {
            //                author: {
            //                    id: 'f2d1d640-adc2-433a-a4ed-6ceba735f4ab',
            //                    firstName: 'Sample',
            //                    lastName: 'User'
            //                },
            //                message: "In the meantime, Petruchio arrives in Padua from Verona, accompanied by his servant Grumio. He explains to Hortensio, an old friend of his, that he has set out to enjoy life after the death of his father, and his main goal is to wed. Hearing this, Hortensio recruits Petruchio as a suitor for Katherina. He also has Petruchio present to Baptista a music tutor named Litio (Hortensio himself in disguise). Thus, Lucentio and Hortensio, pretending to be the tutors Cambio and Litio, attempt to woo Bianca unbeknownst to her father, and to one another.",
            //                messageId: 'id',
            //                receiver: {
            //                    id: 'f2d1d640-adc2-433a-a4ed-6ceba735f4ab',
            //                    firstName: 'Sample',
            //                    lastName: 'Recepient'
            //                }
            //            }
            //        ]
            //    },
            //    {
            //        author: {
            //            id: 'f2d1d640-adc2-433a-a4ed-6ceba735f4ab',
            //            firstName: 'Sample',
            //            lastName: 'User'
            //        },
            //        message: "To counter Katherina's shrewish nature, Petruchio employs reverse psychology, pretending every harsh thing she says or does is kind and gentle. Katherina allows herself to become engaged to Petruchio, and they are married in a farcical ceremony during which he strikes the priest and drinks the communion wine. After the wedding, he takes her to his home against her will. Once they are gone, Gremio and Tranio (disguised as Lucentio) formally bid for Bianca, with Tranio easily outbidding Gremio. However, in his zeal to win, he promises much more than Lucentio actually possesses. When Baptista determines that once Lucentio's father confirms the dowry, Bianca and Tranio (i.e. Lucentio) can marry, Tranio decides they will need someone to pretend to be Vincentio, Lucentio's father. Meanwhile, Tranio persuades Hortensio that Bianca is not worthy of his attentions, thus removing Lucentio's remaining rival.",
            //        messageId: 'id',
            //        receiver: {
            //            id: 'f2d1d640-adc2-433a-a4ed-6ceba735f4ab',
            //            firstName: 'Sample',
            //            lastName: 'Recepient'
            //        },
            //        replies: []
            //    }
            //]);
            //return deferred.promise;

            //GET     /plan-chat/:objId
            return Restangular.one('plan-chat', objId).get();
        }

        function saveReply(objId, text, parentId) {
            //var deferred = $q.defer();
            //deferred.resolve();
            //return deferred.promise;
            //POST /plan-chat
            return Restangular.one('plan-chat', '').customPOST({objId: objId, parentId: parentId, text: text});
        }

        function editReply(objId, messageId, text) {
            //var deferred = $q.defer();
            //deferred.resolve();
            //return deferred.promise;
            //PUT /plan-chat
            return Restangular.one('plan-chat', '').customPUT({objId: objId, messageId: messageId, text: text});
        }

        function deleteReply(objId, messageId) {
            //var deferred = $q.defer();
            //deferred.resolve();
            //return deferred.promise;
            //POST    /plan-chat/delete
            return Restangular.one('plan-chat', 'delete').customPOST({objId: objId, messageId: messageId});
        }

    }

})();