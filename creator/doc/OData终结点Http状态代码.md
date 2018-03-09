Status Code	     Text	                Cause
200              OK                     The request is served.
400              Bad Request            The request could not be parsed successfully because of a                                             syntactically or semantically incorrect URI.
401              Unauthorized           Authentication is required and has not been provided
403              Forbidden              User does not have privileges to access the entity
404              Record Not Found       The record does not exist for the given query.
                                        OR The length of the URI exceeds the maximum allowed length for the browser. For Internet Explorer7 & 8 this is 2,048 characters.
405              Method Not Allowed     A request cannot be used for this record.
406              Not Acceptable         The requested format specified in the accept header cannot be                                         satisfied for the entity/entity container/entity set.
413         Request Entity Too Large    The request attempts to set too much data, or the requested                                           ange contains too many rows, returned data is too big.
500         Internal Server Error       Internal Error
503         Service Unavailable         Service Unavailable
