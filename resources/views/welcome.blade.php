<!DOCTYPE html>
<html lang="en">
    <head>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
        <title>Basic Report</title>

        <script type="text/javascript" src="https://html2canvas.hertzen.com/dist/html2canvas.js"></script>

        <script type='text/javascript' src="{{URL::asset('assets/jquery.js')}}"></script>
        <script type='text/javascript' src="{{URL::asset('assets/highcharts.js')}}"></script>
        <script type='text/javascript' src="{{URL::asset('assets/exporting.js')}}"></script>
        <script type='text/javascript' src="{{URL::asset('assets/file.js')}}"></script>

        <style type='text/css'>
            .container {
                max-width: 600px;
                min-width: 320px;
                margin: 0 auto;
            }
            #buttonrow {
                max-width: 600px;
                min-width: 320px;
                margin: 0 auto;
            }
        </style>

        <script>
            function exportpng()
            {
                var element = $("#wid")[0];
                html2canvas(element).then(function (canvas) {
                    var myImage = canvas.toDataURL('application/pdf');
                    saveAs(myImage, "cartao-virtual.png");
                });
            }

            function saveAs(uri, filename) {
                var link = document.createElement('a');
                if (typeof link.download === 'string') {
                    link.href = uri;
                    link.download = filename;

                    //Firefox requires the link to be in the body
                    document.body.appendChild(link);

                    //simulate click
                    link.click();

                    //remove the link when done
                    document.body.removeChild(link);
                } else
                {
                    window.open(uri);
                }
            }

        </script>
    </head>

    <body>
        <div style="display: table; table-layout: fixed; width: 100%;" id="wid" class="wid">
            <div>
                <img src="{{URL::asset('assets/images/test.jpg')}}"> <br>

                <table class="table" style="margin-top: 20px;">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">First</th>
                        <th scope="col">Last</th>
                        <th scope="col">Handle</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td>Larry</td>
                        <td>the Bird</td>
                        <td>@twitter</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div style="display: table-row">
                <div style="display: table-cell">
                    <div id="container" style="height: 400px"></div>
                </div>

                <div style="display: table-cell">
                    <div id="container2" style="height: 400px"></div>
                </div>
            </div>

            <div style="display: table-row">
                <div style="display: table-cell">
                    <div id="container3" style="height: 400px"></div>
                </div>

                <div style="display: table-cell">
                    <div id="container4" style="height: 400px"></div>
                </div>
            </div>

            @can('export pdf')
            <div>
                <button id="export-pdf">Export to PDF</button>
            </div>
            @endcan

            @can('export excel')
            <div>
                <button onclick="exportpng()">Export to PNG</button>
            </div>
            @endcan
        </div>
    </body>
</html>