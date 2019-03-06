import { tcpMessageParser } from "../deprecated/tcpMessageParser";
import { mapGrid } from "../layergeneration";
import { findPath } from "../pathfinding";
import { DataParser } from "../helper/DataParser";
// import { testObstacleGrid } from "../layergeneration/test";
import { ObstacleGlobal } from "../layergeneration/ObstacleGlobal";

const exampleString =
    "M:-0.199406,-0.0930125,0.442039,0.484934,1.97533,:-0.199406,-0.0930125,0.442039,0.484934,1.97533,:";

const exampleString2 =
    "M:-0.199406,-0.0930125,0.442039,0.484934,1.97533,:-0.785464,-0.689142,4.69399,4.75925,1.73405,:0.226179,-0.576851,4.16152,4.16766,1.51313,:0.0690758,-0.00516959,0.218458,0.229118,1.19645,:0.251188,-0.318293,2.35623,2.36958,1.45851,:0.0928944,-0.144802,0.802481,0.807839,1.43755,:-0.197748,-0.154899,0.771002,0.795958,1.80763,:0.073425,-0.034385,0.242776,0.253637,1.2158,:0.0963322,-0.0235941,0.282349,0.29833,1.18966,:0.37984,-0.36651,2.50424,2.53288,1.41447,:-1.2777,-0.812061,5.62096,5.76435,1.79232,:-0.234891,0.00526957,1.30852,1.32943,1.73935,:-0.21266,-0.0969961,0.462666,0.5092,1.98352,:-0.150812,0.0189678,0.448554,0.473228,1.87277,:-0.185877,0.0242564,0.539352,0.570483,1.88436,:-2.40383,0.0717365,7.16243,7.55505,1.89323,:0.111261,-0.646563,4.65169,4.65303,1.54392,:-0.115055,0.0302377,0.846578,0.85436,1.69121,:-0.101556,0.026644,0.561746,0.570852,1.72834,:0.0604778,-0.0200076,0.349443,0.354638,1.35715,:0.0973355,-0.0431344,0.319902,0.334382,1.22906,:0.0822992,-0.0214692,0.241728,0.255353,1.18141,:0.0608922,-0.0123624,0.229133,0.237086,1.24585,:0.0338292,-0.102897,0.72405,0.72484,1.50466,:0.075714,-0.0169637,0.289898,0.299622,1.26396,:0.0895278,-0.0086358,0.27433,0.28857,1.20133,:0.0488594,-0.00347578,0.14961,0.157386,1.15534,:0.0465055,-0.00727446,0.274599,0.278509,1.34905,:0.0741595,-0.119077,0.673712,0.677781,1.43973,:0.110278,-0.0419449,0.399835,0.414764,1.26458,:0.0467501,-0.0112906,0.277834,0.28174,1.35076,:0.0662139,-0.00608013,0.209901,0.220097,1.19431,:0.0869169,-0.0261065,0.254913,0.269323,1.18416,:0.0798522,-0.126478,0.715451,0.719893,1.43946,:0.085846,-0.0151675,0.319294,0.330633,1.26157,:-0.159977,0.0193892,0.470917,0.497348,1.87709,:0.0980085,-0.0247672,0.287878,0.304105,1.19132,:-0.116694,-0.109485,0.700442,0.710097,1.71861,:0.0685696,-0.00642122,0.216334,0.226941,1.19508,:0.112693,-0.17904,1.0102,1.01647,1.44544,:-0.356055,-0.138072,0.868923,0.939044,1.94941,:0.0183314,-0.130631,0.876864,0.877056,1.53407,:0.0655091,-0.023277,0.235252,0.244203,1.23578,:-0.247386,-0.167586,1.09117,1.11886,1.78338,:0.0849231,-0.0411242,0.279858,0.292459,1.22309,:-0.134889,0.0208159,0.943933,0.953522,1.69968,:0.0383929,-0.0124841,0.226713,0.229941,1.3374,:-0.0045985,-0.0020585,0.0435365,0.0437787,1.32266,:0.0695497,-0.014071,0.342922,0.349904,1.32745,:0.106615,-0.0501414,0.353855,0.369568,1.23626,:-0.010789,0.00125289,0.0258399,0.0280018,1.4146,:0.0756797,-0.035205,0.249958,0.261164,1.21728,:0.104033,-0.05368,0.35326,0.36826,1.24241,:0.0850695,-0.00554218,0.269664,0.282764,1.21018,:0.0787559,-0.0114289,0.233354,0.246285,1.18182,:-0.000340668,0.000578731,0.028794,0.028796,1.00258,:-0.140477,-0.0555336,0.345025,0.372527,1.93091,:0.118212,-0.0942312,0.581131,0.593032,1.34474,:0.279485,-0.225646,1.3619,1.39028,1.35761,:0.0791941,-0.0367574,0.260277,0.272059,1.21831,:0.1337,-0.106696,0.662419,0.675777,1.3494,:0.0802955,-0.00993231,0.236914,0.250152,1.18152,:-0.0112495,-0.00342197,0.0363937,0.0380927,1.48836,:0.0694587,-0.0465872,0.265969,0.274889,1.25929,:0.0310788,-0.0082559,0.18259,0.185216,1.32025,:-0.160754,-0.147237,0.952344,0.965816,1.72539,:0.090633,-0.029618,0.269126,0.283977,1.19098,:0.128126,-0.0941699,0.547664,0.562452,1.31397,:-0.0696555,-0.01137,0.128128,0.145838,2.00757,:0.0419176,-0.0121592,0.231012,0.234784,1.3268,:0.0499684,-0.00901159,0.232103,0.237421,1.29439,:0.0441973,-0.0130787,0.240363,0.244393,1.327,:-0.067262,-0.0141801,0.126655,0.143407,1.9957,:0.0361071,-0.0254072,0.161856,0.165834,1.25828,:0.0502666,-0.0149407,0.221921,0.227542,1.28065,:-0.0684492,-0.00995265,0.127817,0.144992,2.00027,:-0.0634317,-0.0103648,0.11156,0.128333,2.01948,:0.0452042,-0.00805809,0.214093,0.218813,1.29284,:-0.0705842,-0.0159316,0.127937,0.146116,2.01452,:0.0609751,-0.0210131,0.217687,0.226065,1.22907,:0.0465767,-0.00879187,0.217707,0.222634,1.29133,:-0.0134614,0.00483384,0.0261097,0.0293756,1.56355,:0.0485614,-0.0195867,0.298032,0.301962,1.35966,:-0.0311661,-0.0239871,0.141403,0.144797,1.70181,:0.0783229,-0.0393449,0.259734,0.271286,1.22066,:0.0621032,-0.00960012,0.214346,0.223161,1.21914,:0.0638248,-0.0233045,0.225309,0.234174,1.2285,:-0.0643822,-0.012477,0.124648,0.140293,1.98157,:-0.0651692,-0.0122634,0.140422,0.154807,1.94231,:0.04495,8.70856e-05,0.1991,0.204111,1.27347,:0.0462275,-0.00691586,0.172414,0.178504,1.22177,:-0.000188067,0.00356174,0.0405913,0.0405917,1.18019,:-0.181839,-0.0561848,0.384954,0.425741,1.99063,:0.0254069,-0.00719955,0.152533,0.154635,1.30718,:";

const exampleString3 =
    "M:-0.133085,-0.0828762,1.07578,1.08398,1.7929,:-0.117224,-0.121661,0.898944,0.906555,1.82024,:-0.351893,-0.259935,1.22593,1.27543,1.93857,:-0.413575,-0.17945,1.19009,1.2599,1.99572,:-0.377098,-0.249958,1.16851,1.22785,1.97542,:-0.4126,-0.119218,0.749519,0.85558,2.20976,:-0.409204,-0.148786,0.762892,0.865709,2.19731,:-0.292653,-0.30534,1.21855,1.2532,1.89526,:-0.33848,-0.321152,1.19434,1.24138,1.93761,:-0.0222411,-0.12943,0.998327,0.998574,1.69579,:-0.427159,-0.20167,0.713512,0.831604,2.24966,:-0.331669,-0.132718,0.797413,0.863638,2.09902,:-0.322003,-0.152908,0.793915,0.85673,2.09116,:-0.372376,-0.138588,0.752419,0.839523,2.16876,:-0.0965697,-0.204835,0.901362,0.906521,1.79617,:-0.377968,-0.146443,1.27536,1.33019,1.94362,:-0.372074,-0.218464,0.686066,0.780465,2.21661,:-0.34788,-0.223137,0.758934,0.834866,2.13966,:-0.334061,-0.260058,0.748451,0.81962,2.13222,:-0.366939,-0.106389,0.790506,0.871518,2.13855,:-0.00406016,-0.217059,0.963367,0.963375,1.68063,:-0.0404951,-0.239379,0.905127,0.906033,1.7308,:-0.436465,-0.090011,0.77025,0.885318,2.21746,:-0.27894,-0.383913,1.17941,1.21194,1.89482,:-0.436734,-0.130716,0.727498,0.848522,2.24809,:-0.29262,-0.306209,1.22004,1.25464,1.89484,:-0.381144,-0.321327,1.12655,1.18928,1.99283,:-0.261998,-0.254434,1.3002,1.32634,1.85236,:-0.090869,-0.165669,0.94114,0.945517,1.78002,:-0.111673,-0.189153,0.924777,0.931496,1.80692,:-0.394609,-0.260318,0.659556,0.76859,2.26077,:-0.369395,-0.194488,0.728673,0.816956,2.18225,:-0.354176,-0.125604,0.786531,0.862596,2.12839,:-0.337589,-0.140592,0.786992,0.856343,2.11135,:-0.374163,-0.219836,0.688838,0.783898,2.21661,:-0.367669,-0.241475,0.708104,0.797867,2.19539,:-0.0585234,-0.151719,0.968246,0.970013,1.73926,:-0.0598374,-0.19529,0.941305,0.943205,1.7458,:-0.131412,-0.192936,0.83957,0.849793,1.85551,:-0.31296,-0.228929,0.772006,0.833029,2.0949,:-0.32439,-0.226719,0.719291,0.789056,2.14168,:-0.334751,-0.260907,0.748964,0.820369,2.1326,:-0.323377,-0.211249,0.775081,0.839835,2.10399,:-0.00361224,-0.206444,0.947548,0.947555,1.68208,:-0.0547846,-0.216507,0.928829,0.930443,1.7426,:-0.073271,-0.0516804,1.08689,1.08936,1.73408,:-0.408907,-0.0934099,0.774974,0.876236,2.18889,:-0.38019,-0.252357,1.17166,1.2318,1.97675,:-0.38645,-0.323707,1.13652,1.20042,1.99348,:-0.368457,-0.124593,0.799187,0.880034,2.13465,:-0.335169,-0.140038,0.784275,0.852893,2.11054,:-0.259953,-0.125403,1.27979,1.30593,1.85529,:-0.353458,-0.122231,1.29722,1.34452,1.92011,:-0.33808,-0.0882509,0.839508,0.905026,2.08132,:-0.372099,-0.0931402,0.80445,0.886339,2.13495,:-0.357534,-0.226718,0.715856,0.800175,2.17927,:-0.389371,-0.182443,0.740494,0.836625,2.19378,:-0.390408,-0.185887,0.788186,0.879577,2.16274,:-0.104292,-0.198762,0.883485,0.889619,1.80988,:-0.0430895,-0.243777,0.921817,0.922824,1.73068,:-0.0433316,-0.14002,0.991459,0.992406,1.71908,:-0.41028,-0.149298,0.763483,0.866739,2.19792,:-0.343158,-0.255699,1.20667,1.25451,1.93757,:-0.108638,-0.191448,0.90848,0.914953,1.80792,:-0.0432976,-0.243627,0.917332,0.918354,1.73175,:-0.0827799,-0.0550417,1.16668,1.16961,1.73086,:-0.114706,-0.0598269,1.04244,1.04873,1.7823,:-0.0579402,-0.102467,0.94941,0.951177,1.74214,:-0.331064,-0.156198,0.783317,0.850406,2.10691,:-0.428461,-0.188821,0.733209,0.849219,2.23626,:-0.324586,-0.248429,1.26021,1.30134,1.90869,:-0.346338,-0.259477,1.21523,1.26362,1.93748,:-0.359979,-0.193721,0.762854,0.843523,2.14938,:-0.331178,-0.230103,0.723386,0.795592,2.14614,:-0.0818246,-0.239016,0.859936,0.86382,1.78988,:-0.0447535,-0.231962,0.963645,0.964684,1.72516,:-0.0748938,-0.105503,1.04291,1.04559,1.74291,:-0.418176,-0.0763701,0.755586,0.863587,2.21076,:-0.276392,-0.140418,1.31102,1.33984,1.86069,:-0.0144401,-0.18108,0.96128,0.961389,1.69233,:-0.400872,-0.261502,0.76862,0.866876,2.18555,:-0.409701,-0.150214,0.761153,0.864413,2.19897,:-0.375902,-0.25487,1.15764,1.21715,1.97809,:-0.163886,-0.207532,1.00421,1.0175,1.84001,:-0.111183,-0.184442,0.732905,0.74129,1.87063,:-0.355485,-0.1271,0.789246,0.865609,2.12801,:-0.424895,-0.172285,0.97182,1.06065,2.09195,:-0.281112,-0.136717,1.32886,1.35827,1.86025,:-0.0103792,-0.174639,0.915124,0.915183,1.69416,:-0.0136991,-0.246314,0.950414,0.950513,1.69298,:-0.399693,-0.258985,0.79849,0.892939,2.16496,:-0.314466,-0.24198,1.23543,1.27482,1.90761,:-0.108113,-0.196888,0.911025,0.917418,1.80664,:-0.0797305,-0.0530515,1.08471,1.08764,1.7406,:-0.475243,-0.105744,1.14545,1.24012,2.05688,:-0.275283,-0.136774,1.31054,1.33914,1.85998,:-0.0413735,-0.137326,0.923534,0.924461,1.72842,:-0.147733,-0.158605,0.929609,0.941275,1.84478,:-0.33411,-0.235074,0.725385,0.798632,2.14789,:-0.394158,-0.325615,1.14494,1.21089,1.9965,:-0.385978,-0.179638,0.979493,1.0528,2.05553,:-0.395367,-0.117076,0.725151,0.82593,2.21061,:-0.406653,-0.14774,0.753694,0.856401,2.20122,:-0.344039,-0.260307,1.21006,1.25801,1.93725,:-0.378386,-0.25578,1.16138,1.22147,1.97876,:-0.154031,-0.199425,0.944852,0.957325,1.8469,:-0.417796,-0.238234,1.06705,1.14593,2.04428,:-0.0379883,-0.20077,0.933425,0.934198,1.72283,:-0.290436,-0.199789,0.762808,0.816229,2.07618,:-0.388583,-0.118026,0.984973,1.05885,2.05529,:-0.260429,-0.242689,1.24102,1.26805,1.86453,:-0.0986622,-0.062589,1.11376,1.11812,1.75351,:-0.326818,-0.118925,1.32181,1.36161,1.89486,:-0.32471,-0.175539,1.28623,1.32659,1.90209,:-0.232846,-0.135962,1.23912,1.26081,1.84329,:-0.518146,-0.131571,0.597647,0.790985,2.4276,:-0.287514,-0.166015,0.814318,0.863584,2.04344,:-0.472334,-0.10871,0.70485,0.848477,2.29722,:-0.388523,-0.149658,0.653662,0.76041,2.25953,:-0.442392,-0.207972,0.532578,0.692351,2.42699,:-0.416982,-0.219522,0.652512,0.774368,2.28872,:-0.459216,-0.131495,0.735826,0.867364,2.26225,:-0.42054,-0.159535,0.704459,0.820437,2.25031,:-0.0660147,-0.161235,0.950374,0.952664,1.75082,:-0.514489,-0.163172,0.6597,0.836602,2.3696,:-0.405294,-0.219509,0.687608,0.798165,2.24872,:-0.107749,-0.203082,0.895282,0.901743,1.81054,:-0.0893446,-0.239544,0.867134,0.871725,1.79691,:-0.479014,-0.210144,0.644184,0.802762,2.35287,:-0.283068,-0.228995,0.769859,0.82025,2.06383,:-0.344584,-0.226816,0.724799,0.802541,2.15938,:-0.469968,-0.194581,0.582415,0.748383,2.4014,:-0.467507,-0.227631,0.597373,0.758563,2.38497,:-0.444687,-0.20872,0.533977,0.694894,2.42762,:-0.524516,-0.108458,0.719381,0.890295,2.32985,:-0.49104,-0.158278,0.678124,0.837241,2.3347,:-0.25426,-0.193451,0.80729,0.846384,2.01118,:-0.545914,-0.114055,0.684996,0.875923,2.37387,:-0.41906,-0.120258,0.757248,0.865469,2.21043,:-0.433,-0.151254,0.728374,0.847359,2.24401,:-0.520541,-0.123974,1.24427,1.34876,2.05228,:-0.338321,-0.0765582,0.870872,0.93428,2.06477,:-0.0367253,-0.186908,0.960653,0.961355,1.71689,:-0.290517,-0.167526,0.817556,0.86764,2.04486,:-0.385272,-0.181106,0.744086,0.837913,2.18724,:-0.264395,-0.219336,1.26704,1.29433,1.86155,:-0.370097,-0.233539,0.685977,0.779446,2.21464,:-0.401158,-0.165263,0.665724,0.777249,2.26222,:-0.468745,-0.207817,0.634575,0.788928,2.35222,:-0.404092,-0.213917,0.637188,0.754519,2.28921,:-0.419861,-0.223678,0.620164,0.748924,2.31974,:-0.44829,-0.253412,0.609051,0.756245,2.35672,:-0.0103735,-0.237743,0.946193,0.946249,1.68984,:-0.277536,-0.225651,0.761369,0.810376,2.06274,:-0.27207,-0.131921,1.34529,1.37253,1.85021,:-0.480421,-0.111296,0.70071,0.849587,2.30749,:-0.44065,-0.149754,0.694754,0.822712,2.27665,:-0.477364,-0.133855,0.746547,0.88612,2.27029,:-0.440538,-0.143663,1.09927,1.18426,2.04905,:-0.428882,-0.186935,1.2076,1.2815,2.00108,:-0.413906,-0.227868,1.07949,1.15612,2.03622,:-0.377579,-0.221482,0.732043,0.823683,2.18808,:-0.400838,-0.192613,0.687659,0.795956,2.24431,:-0.449743,-0.203508,0.618414,0.76466,2.34951,:-0.449173,-0.227909,0.616562,0.762828,2.35066,:-0.42872,-0.243061,0.68869,0.81123,2.27032,:-0.30508,-0.238437,0.798541,0.854834,2.0708,:-0.0155576,-0.181021,0.96307,0.963196,1.69332,:-0.289817,-0.254725,0.753882,0.807671,2.08098,:-0.398433,-0.168403,0.67067,0.780094,2.25548,:-0.503089,-0.186547,0.690636,0.854445,2.33475,:-0.438592,-0.210031,0.660512,0.792867,2.30251,:-0.401546,-0.178267,0.580053,0.70548,2.3392,:-0.446175,-0.253846,0.606966,0.753313,2.3567,:-0.333707,-0.145614,0.765423,0.835005,2.12083,:-0.10153,-0.186893,0.92083,0.926411,1.79673,:-0.503922,-0.188014,0.582653,0.770338,2.43015,:-0.235738,-0.12115,1.24381,1.26595,1.84454,:-0.325686,-0.36696,1.16747,1.21204,1.93566,:-0.483935,-0.188703,0.574665,0.751287,2.42106,:-0.554128,-0.120901,0.703192,0.895286,2.36574,:-0.451511,-0.102511,1.13565,1.22211,2.04322,:-0.385903,-0.173972,0.995734,1.0679,2.04823,:-0.423972,-0.23458,1.08856,1.16821,2.04052,:-0.384671,-0.194151,0.660188,0.764081,2.2502,:-0.319985,-0.286668,0.900164,0.955346,2.03252,:-0.0460107,-0.238618,0.983488,0.984563,1.72321,:-0.0117993,-0.238607,0.945658,0.945732,1.69151,:-0.0689979,-0.244564,0.907925,0.910543,1.76311,:-0.457586,-0.206693,0.624739,0.774392,2.35096,:-0.513364,-0.149399,0.627078,0.810413,2.39692,:-0.543641,-0.199973,0.635022,0.835942,2.41409,:-0.384792,-0.240462,0.699618,0.798455,2.21912,:-0.282478,-0.215621,0.746743,0.798385,2.07723,:-0.317358,-0.223826,0.709133,0.776908,2.14112,:-0.329311,-0.286717,0.819824,0.883492,2.08359,:-0.42652,-0.263706,0.643104,0.771688,2.30592,:-0.380981,-0.148837,1.28063,1.3361,1.9443,:-0.272135,-0.213549,0.807508,0.852131,2.03063,:-0.4565,-0.168814,0.65043,0.794639,2.32749,:-0.454027,-0.194915,0.680861,0.818359,2.29995,:-0.453111,-0.178857,0.665821,0.805373,2.31145,:-0.293895,-0.197566,0.770024,0.824203,2.0756,:-0.416178,-0.248885,0.620878,0.747458,2.31552,:-0.519217,-0.205498,0.619945,0.808651,2.40806,:-0.42909,-0.221206,0.657545,0.785164,2.29607,:-0.392258,-0.143319,1.31936,1.37644,1.9416,:-0.277148,-0.108497,0.846177,0.890408,2.01596,:-0.332191,-0.0777064,0.825693,0.890011,2.08317,:-0.44416,-0.355275,1.08621,1.17351,2.05705,:-0.383497,-0.321315,1.12792,1.19133,1.9942,:-0.0986792,-0.197351,0.871797,0.877364,1.80664,:-0.363118,-0.174335,0.711749,0.799026,2.18803,:-0.420521,-0.167945,0.690917,0.808829,2.2608,:-0.482331,-0.174839,0.713172,0.860963,2.29946,:-0.480429,-0.10126,0.681129,0.833516,2.32313,:-0.352422,-0.147908,0.802396,0.876379,2.11692,:-0.309859,-0.149021,0.805753,0.863278,2.07167,:-0.389193,-0.212056,0.634803,0.744612,2.27628,:-0.451393,-0.194793,0.618715,0.765874,2.35075,:-0.480681,-0.183436,0.618537,0.783353,2.37702,:-0.38528,-0.133394,0.69421,0.793957,2.22375,:-0.0608301,-0.193398,0.933718,0.935698,1.74841,:-0.400513,-0.229394,1.04762,1.12157,2.03835,:-0.467972,-0.310353,1.14106,1.2333,2.05327,:-0.267575,-0.190567,0.765346,0.810772,2.04921,:-0.387497,-0.195044,0.661958,0.767035,2.25162,:-0.392917,-0.14993,1.30862,1.36633,1.94498,:-0.52704,-0.10863,0.724162,0.895646,2.32824,:-0.496448,-0.146985,0.629495,0.801701,2.3807,:-0.349299,-0.148316,0.798925,0.871947,2.1159,:-0.484658,-0.209855,0.645889,0.807506,2.35629,:-0.307111,-0.219217,0.732624,0.794389,2.11373,:-0.325019,-0.264925,0.749655,0.81708,2.12187,:-0.343661,-0.0814945,0.847396,0.914431,2.08245,:-0.401182,-0.15084,0.743873,0.845159,2.20285,:-0.396938,-0.216587,0.645221,0.757542,2.27515,:-0.378862,-0.223531,0.651481,0.753634,2.25147,:-0.401904,-0.234287,0.627167,0.744893,2.29581,:-0.32917,-0.252157,0.867596,0.927941,2.0576,:-0.514852,-0.238093,1.2269,1.33055,2.05457,:-0.381018,-0.193916,0.925936,1.00127,2.07647,:-0.41002,-0.177013,0.714065,0.823411,2.23299,:-0.116321,-0.0571941,1.04762,1.05406,1.78279,:-0.373282,-0.317924,1.11366,1.17455,1.99119,:-0.438383,-0.248437,0.601617,0.744394,2.35442,:-0.492867,-0.180313,0.625382,0.796254,2.38133,:-0.515528,-0.191827,0.590073,0.783553,2.43259,:-0.0817968,-0.237617,0.877929,0.881731,1.78514,:-0.502993,-0.128384,0.587899,0.77371,2.42438,:-0.0964335,-0.179188,0.931949,0.936925,1.78831,:-0.470697,-0.18031,0.664443,0.814273,2.32835,:-0.0935163,-0.203927,0.917369,0.922123,1.78866,:-0.429806,-0.0785431,0.774579,0.885836,2.20847,:-0.440494,-0.123756,0.703544,0.830066,2.26965,:-0.326026,-0.0959795,0.854527,0.914609,2.06133,:-0.369002,-0.0943417,0.80039,0.881355,2.13444,:-0.428596,-0.144056,0.73911,0.854388,2.23211,:-0.470751,-0.194189,0.582197,0.748706,2.4023,:-0.10783,-0.255476,0.914334,0.920671,1.80544,:-0.303429,-0.354611,1.19879,1.2366,1.90902,:-0.424463,-0.162666,0.663222,0.787421,2.28693,:-0.383952,-0.178791,0.867106,0.948311,2.10977,:-0.320696,-0.194534,1.25488,1.29521,1.90717,:-0.293511,-0.312854,1.22946,1.26401,1.89309,:-0.364439,-0.271122,0.980866,1.04638,2.03628,:-0.439792,-0.249963,0.700453,0.827074,2.2714,:-0.429542,-0.171032,0.895812,0.993471,2.13463,:-0.292772,-0.23316,0.78002,0.833154,2.06843,:-0.262406,-0.22444,0.659248,0.709553,2.11319,:-0.477261,-0.250325,0.891878,1.01155,2.1769,:-0.102703,-0.222814,0.925486,0.931167,1.79684,:-0.164437,-0.250848,0.963398,0.977331,1.85221,:-0.386863,-0.285349,0.914158,0.992647,2.08756,:-0.272942,-0.109714,0.84363,0.886684,2.01282,:-0.465835,-0.0905865,0.867818,0.984942,2.18131,:-0.325297,-0.218184,0.884991,0.942882,2.04503,:-0.414069,-0.224351,0.564938,0.700434,2.36659,:-0.0322073,-0.161984,0.889603,0.890186,1.72394,:-0.289734,-0.174027,0.503226,0.580674,2.29278,:-0.49817,-0.247052,0.672708,0.837084,2.34519,:-0.327213,-0.27167,0.821045,0.883845,2.08079,:-0.437607,-0.269992,0.684401,0.812345,2.28204,:-0.361456,-0.0983211,1.32727,1.37561,1.91805,:-0.280311,-0.229908,1.15953,1.19293,1.90142,:-0.351504,-0.20929,0.74953,0.827859,2.14961,:-0.0729123,-0.147982,0.954809,0.957589,1.75745,:-0.0567653,-0.206073,0.922404,0.924149,1.74611,:-0.280178,-0.213378,0.74317,0.79423,2.07687,:-0.0562656,-0.208093,0.922452,0.924166,1.74553,:-0.377307,-0.206667,1.25246,1.30806,1.94968,:-0.0491794,-0.20731,0.969229,0.970476,1.729,:-0.382605,-0.248856,0.761274,0.852012,2.17288,:-0.102439,-0.202013,0.879625,0.88557,1.80882,:-0.231072,-0.0768782,1.26921,1.29007,1.83542,:-0.338079,-0.157737,0.796181,0.864987,2.10627,:-0.0395116,-0.185765,0.852517,0.853432,1.74009,:-0.322241,-0.156403,1.20058,1.24308,1.92321,:-0.345578,-0.336301,0.961467,1.02169,2.02811,:-0.552243,-0.120442,1.29471,1.40757,2.05569,:-0.405103,-0.17726,1.16365,1.23215,1.99836,:-0.378849,-0.109241,0.805948,0.89055,2.14053,:-0.0748002,-0.22604,0.91842,0.921461,1.76736,:-0.0904519,-0.226745,0.937326,0.94168,1.78045,:-0.47034,-0.202737,1.28574,1.36907,2.00486,:-0.071093,-0.0578081,1.0259,1.02836,1.74206,:-0.36902,-0.195352,0.72806,0.816239,2.1823,:-0.0805622,-0.0677674,1.0586,1.06166,1.74579,:-0.373409,-0.218397,0.740306,0.829149,2.17811,:-0.374109,-0.182745,0.758544,0.845782,2.16635,:-0.0385352,-0.186333,0.956585,0.957361,1.71954,:-0.367034,-0.242677,0.70614,0.795832,2.19619,:-0.356366,-0.293945,0.920085,0.986688,2.05706,:-0.339959,-0.160219,1.23822,1.28404,1.92613,:-0.340114,-0.14389,0.774377,0.845777,2.12177,:0.0797797,0.026156,0.0977507,0.126174,2.01989,:0.0791885,0.0251,0.098081,0.126058,2.03093,:0.0770493,0.0244251,0.0977003,0.124426,2.08902,:0.0795641,0.0212896,0.098613,0.126708,2.01482,:0.0815663,0.0244678,0.100492,0.129428,1.94311,:0.0794044,0.0230267,0.0997385,0.127487,2.00557,:0.0807517,0.0252308,0.0993585,0.128035,1.97587,:0.0832183,0.027368,0.0985719,0.129003,1.91848,:0.082743,0.0195561,0.101186,0.130709,1.90641,:0.0815016,0.0214566,0.100759,0.129595,1.94211,:0.0817234,0.0189588,0.100273,0.129357,1.94128,:0.0819182,0.025883,0.09783,0.127598,1.96201,:0.0849418,0.0244958,0.103212,0.133671,1.8342,:0.0808259,0.0227338,0.100159,0.128703,1.96535,:0.0794157,0.0219813,0.0989286,0.126861,2.01478,:0.0821574,0.0202642,0.102998,0.131751,1.90527,:0.082906,0.0239646,0.10098,0.130653,1.90405,:0.0856379,0.0265452,0.100353,0.131926,1.83627,:0.0833759,0.0255908,0.0998652,0.130095,1.9018,:0.0757713,0.023273,0.0922882,0.119409,2.20747,:0.0813241,0.0270579,0.0978372,0.127223,1.97802,:0.083787,0.0245053,0.103572,0.133219,1.8606,:0.0848655,0.0261283,0.103955,0.134197,1.83111,:0.0811421,0.0270609,0.0983358,0.127491,1.97714,:0.0790712,0.0206382,0.0975193,0.125548,2.04112,:0.0809424,0.02367,0.0990781,0.127938,1.97404,:0.0780088,0.0236833,0.0983168,0.125505,2.05738,:0.0758983,0.023833,0.0988189,0.124602,2.10092,:0.0820251,0.0262469,0.0988716,0.128467,1.94777,:0.0817422,0.0257446,0.0978052,0.127466,1.96708,:0.082097,0.0248224,0.0989906,0.128604,1.9446,:0.0806634,0.0234712,0.0997994,0.128322,1.97331,:0.0847543,0.0238607,0.106394,0.136025,1.81847,:0.0749007,0.0215014,0.101843,0.126421,2.08445,:0.077573,0.0232598,0.0991892,0.125921,2.05677,:0.0832789,0.0237094,0.102353,0.131953,1.88277,:0.0803178,0.0218576,0.100146,0.128375,1.97829,:0.0791976,0.0218831,0.0993883,0.127084,2.01477,:0.078186,0.0237064,0.0989392,0.126103,2.04511,:0.077536,0.0211884,0.0985167,0.125369,2.0663,:0.0798205,0.0226987,0.0993887,0.127473,1.99921,:0.0812839,0.0226035,0.100939,0.129598,1.94583,:0.0837112,0.0220603,0.103707,0.133276,1.86148,:0.0790162,0.0205711,0.09772,0.125669,2.03992,:0.0823108,0.0279538,0.0969476,0.127177,1.96121,:0.0811613,0.0199801,0.100791,0.129406,1.95038,:0.0814326,0.0226335,0.100614,0.129439,1.94531,:0.0790622,0.0187362,0.0991767,0.126834,2.02064,:0.0835736,0.027043,0.0998731,0.130227,1.89642,:0.0789862,0.0209274,0.0995414,0.127072,2.01818,:0.0788854,0.0266303,0.0980604,0.125852,2.03887,:0.0795958,0.0191873,0.0980291,0.126274,2.02117,:0.0798492,0.0244082,0.0971919,0.125786,2.02516,:0.0777182,0.0248676,0.0970054,0.124299,2.08225,:0.0819436,0.0273594,0.0974371,0.127314,1.96578,:0.0834932,0.022419,0.103578,0.13304,1.86781,:0.0819843,0.0200789,0.103554,0.132079,1.90479,:0.0787554,0.0208525,0.0993118,0.126749,2.02659,:0.0769173,0.0241564,0.0988261,0.125231,2.07704,:0.079385,0.0229257,0.0989518,0.12686,2.01528,:0.0825001,0.0194312,0.10289,0.131881,1.89777,:0.0734874,0.0183075,0.100458,0.124468,2.13211,:0.0799363,0.02339,0.0986697,0.126986,2.00466,:0.0845809,0.025882,0.105029,0.134852,1.83108,:0.0831667,0.0268607,0.108838,0.136976,1.83987,:0.0805764,0.022157,0.0956493,0.125065,2.02589,:0.0808505,0.0248862,0.096846,0.126158,2.00278,:0.0840374,0.0256208,0.105892,0.135187,1.8385,:0.0838803,0.0244262,0.103763,0.133426,1.8569,:0.0815814,0.0264439,0.101464,0.130194,1.93329,:0.0827507,0.0217422,0.0919696,0.123718,2.01398,:0.0800425,0.0233839,0.0984549,0.126886,2.00449,:0.0841245,0.019439,0.102844,0.132868,1.85756,:0.0832452,0.0272915,0.0983486,0.12885,1.91998,:0.0828211,0.0215605,0.101736,0.131185,1.89956,:0.0783771,0.027329,0.09713,0.124809,2.06398,:0.081928,0.0265771,0.115255,0.141407,1.82973,:0.083418,0.0279172,0.10665,0.135399,1.848,:0.0800453,0.0233622,0.0984716,0.126901,2.00422,:0.0829409,0.025918,0.0929459,0.124572,1.99363,:0.082137,0.0172222,0.110488,0.137674,1.85197,:0.0832731,0.0203132,0.100569,0.13057,1.89814,:0.0492805,-0.0063604,0.381099,0.384272,1.71462,:-0.00188137,-0.0959547,0.685353,0.685355,1.72584,:-0.0872734,-0.139574,0.509334,0.516757,1.96096,:0.0833222,0.0275653,0.106717,0.135393,1.84976,:0.0314411,-0.0652703,0.478632,0.479664,1.72344,:0.0835682,0.0279715,0.0990314,0.12958,1.90438,:-0.285662,-0.217336,0.794705,0.844487,2.0523,:0.0835776,0.0255203,0.104355,0.133698,1.86002,:0.0850954,0.0246162,0.104135,0.134482,1.82421,:0.0824817,0.0227712,0.0952058,0.125966,1.97736,:0.0765004,0.0256167,0.100353,0.126186,2.06729,:0.0833032,0.0277753,0.100138,0.130258,1.90124,:0.0785158,0.0221522,0.0982093,0.125737,2.04623,:0.0766661,0.0198436,0.0999109,0.125936,2.06899,:0.0783104,0.0247054,0.107154,0.132719,1.957,:-0.282202,-0.193063,0.651876,0.710338,2.14301,:-0.132116,-0.139165,1.02264,1.03114,1.80385,:0.0826653,0.0198195,0.10208,0.131354,1.90052,:-0.277456,-0.320422,1.20361,1.23517,1.8872,:-0.130267,-0.0832608,0.666301,0.678915,1.92983,:-0.17812,-0.223102,0.887144,0.904849,1.8919,:0.0836732,0.0247166,0.101777,0.131757,1.87741,:0.0929669,0.028804,0.0814637,0.123609,1.69553,:0.0863419,0.0259653,0.0962732,0.129319,1.84889,:-0.226133,-0.265694,0.840764,0.870644,1.96379,:";

const exampleString4 =
    "0,0.968517,0,0.770111,0.385994,0.896283,0.919713,0.936407,0.932002,0.926296,1.11689,1.30847,1.16218,1.19196,1.26318,";

const printObstacleGrid = (obstacleGrid: number[][][]): void => {
    for (let i=0; i < obstacleGrid.length; i++) {
        for (let j=0; j < obstacleGrid[0].length; j++) {
            process.stdout.write(`[${obstacleGrid[i][j].toString()}]`)
        }
        console.log();
    }
}

export const codeTest = (stringData: string = exampleString4) => {
    // let obstacleMap = DataParser.stringToObstacle(stringData).level2;

    // // console.log("obstacleMap: ", JSON.stringify(obstacleMap));

    // try {
    //     let obstacleGrid = mapGrid(obstacleMap, [5, 30], [-1, 0], [1, 10]);
    //     console.log(obstacleGrid);

    //     let path = findPath(obstacleGrid, [2, 0], [2, 29]);

    //     // console.log("Path: ", path);
    // } catch (e) {
    //     console.log("stringData: ", stringData);
    //     throw new Error("Pause");
    // }

    let obstacleMap = DataParser.stringToGrid(stringData, [3, 5]).level2;
    let obstacleGrid = mapGrid(
        obstacleMap,
        [5, 30],
        [0, 0],
        [5, 2],
        [2.943999, 101.876484],
        1,
        0
    );

    printObstacleGrid(obstacleGrid);
};
